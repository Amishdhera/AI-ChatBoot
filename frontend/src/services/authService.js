import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

function mapAuthError(err) {
  const code = err?.code || "";
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
  };
  return new Error(map[code] || "Something went wrong. Please try again.");
}

export async function registerUser({ fullName, email, password }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });

    // Create the Firestore user profile document (users/{uid}).
    // Security rules ensure a user may only ever write their own doc.
    await setDoc(doc(db, "users", cred.user.uid), {
      name: fullName,
      email,
      photoURL: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return cred.user;
  } catch (err) {
    throw mapAuthError(err);
  }
}

export async function loginUser({ email, password, rememberMe }) {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err) {
    throw mapAuthError(err);
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw mapAuthError(err);
  }
}

export async function changePassword({ currentPassword, newPassword }) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("You must be signed in.");
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (err) {
    throw mapAuthError(err);
  }
}

export async function deleteAccount({ currentPassword }) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("You must be signed in.");
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  } catch (err) {
    throw mapAuthError(err);
  }
}
