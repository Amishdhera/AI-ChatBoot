import { db, FieldValue } from "../config/firebase.js";
import { AppError } from "../middleware/errorHandler.js";

// All helpers take `uid` explicitly (taken from the verified ID token in the
// route, never from the request body) so a user can only ever read or write
// documents nested under users/{uid}/...

const usersCol = () => db.collection("users");
const conversationsCol = (uid) => usersCol().doc(uid).collection("conversations");
const messagesCol = (uid, conversationId) =>
  conversationsCol(uid).doc(conversationId).collection("messages");

export async function ensureUserProfile(uid, { name, email, photoURL = null }) {
  const ref = usersCol().doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      name,
      email,
      photoURL,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  return ref;
}

export async function listConversations(uid) {
  const snap = await conversationsCol(uid).orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getConversation(uid, conversationId) {
  const ref = conversationsCol(uid).doc(conversationId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new AppError("Conversation not found.", 404);
  }
  return { ref, id: snap.id, ...snap.data() };
}

export async function createConversation(uid, title = "New chat") {
  const ref = await conversationsCol(uid).add({
    title,
    userId: uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

export async function renameConversation(uid, conversationId, title) {
  const { ref } = await getConversation(uid, conversationId);
  await ref.update({ title, updatedAt: FieldValue.serverTimestamp() });
  return { id: conversationId, title };
}

export async function deleteConversation(uid, conversationId) {
  const { ref } = await getConversation(uid, conversationId);
  // Delete all messages in the subcollection first (batched).
  const messagesSnap = await messagesCol(uid, conversationId).get();
  const batch = db.batch();
  messagesSnap.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(ref);
  await batch.commit();
}

export async function listMessages(uid, conversationId, limit = 200) {
  await getConversation(uid, conversationId); // ownership check
  const snap = await messagesCol(uid, conversationId)
    .orderBy("createdAt", "asc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMessage(uid, conversationId, { role, content }) {
  await getConversation(uid, conversationId); // ownership check
  const ref = await messagesCol(uid, conversationId).add({
    role,
    content,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snap = await ref.get();
  await conversationsCol(uid)
    .doc(conversationId)
    .update({ updatedAt: FieldValue.serverTimestamp() });
  return { id: ref.id, ...snap.data() };
}

export async function deleteMessage(uid, conversationId, messageId) {
  await getConversation(uid, conversationId); // ownership check
  const ref = messagesCol(uid, conversationId).doc(messageId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new AppError("Message not found.", 404);
  }
  await ref.delete();
}

export { conversationsCol, messagesCol };
