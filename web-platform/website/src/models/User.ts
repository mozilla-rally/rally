import { User as FirebaseUser } from "firebase/auth";

export interface User {
  firebaseUser: FirebaseUser;
}