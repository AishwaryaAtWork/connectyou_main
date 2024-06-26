/**
 * Login component for ConnectYou web application.
 * @returns {JSX.Element} Login form with options to sign in with Google or Facebook.
 */
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ToastMessage from "@/components/ToastMessage";
import { useAuth } from "@/context/authContext";
import { auth } from "@/firebase/firebase";
import {
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IoLogoGoogle } from "react-icons/io";
import { toast } from "react-toastify";

const gProvider = new GoogleAuthProvider();

const Login = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();
    const [email, setEmail] = useState("");

    const pushToHome = useCallback(() => {
        router.push("/");
    }, [router]);

    useEffect(() => {
        if (!isLoading && currentUser) {
            pushToHome();
        }
    }, [currentUser, isLoading, pushToHome]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const errorMessage = getFirebaseAuthErrorMessage(error.code);
            toast.error(errorMessage);
        }
    };

    // Function to map Firebase Auth error codes to user-friendly error messages
    const getFirebaseAuthErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'User not found. Please check your email.';
            case 'auth/wrong-password':
                return 'Invalid password. Please try again.';
            default:
                return 'Authentication failed. Please try again.';
        }
    };

    const resetPassword = async () => {
        try {
            toast.promise(
                async () => {
                    await sendPasswordResetEmail(auth, email);
                },
                {
                    pending: "Generating reset link",
                    success: "Reset email sent to your registered email.",
                    error: "You may have entered the wrong email!",
                },
                {
                    autoClose: 5000,
                }
            );
        } catch (error) {
            // console.error("An error occurred", error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, gProvider);
        } catch (error) {
            // console.error("An error occurred", error);
        }
    };

    return isLoading || (!isLoading && !!currentUser) ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <div className="min-h-[120vh] md:min-h-screen flex justify-center items-center bg-c1">
                <ToastMessage />
                <div className="flex items-center flex-col w-10/12 md:w-auto">
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold">
                            Login to Your Account
                        </div>
                        <div className="mt-3 text-c3">
                            Connect and chat with anyone, anywhere
                        </div>
                    </div>
                    {/* <div className="flex flex-col items-center gap-2 w-full mt-10 mb-5">
                        <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-14 rounded-md cursor-pointer p-[1px]"
                            onClick={signInWithGoogle}
                        >
                            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
                                <IoLogoGoogle size={24} />
                                <span>Login with Google</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-5 h-[1px] bg-c3"></span>
                        <span className="text-c3 font-semibold">OR</span>
                        <span className="w-5 h-[1px] bg-c3"></span>
                    </div> */}
                    <form
                        className="flex flex-col items-center gap-3 w-full max-w-md mt-5 px-5"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
                            autoComplete="off"
                        />
                        <div className="text-right w-full text-c3">
                            <span
                                className="cursor-pointer"
                                onClick={resetPassword}
                            >
                                Forgot Password?
                            </span>
                        </div>
                        <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition duration-300 transform hover:scale-105">
                            Login to Your Account
                        </button>
                    </form>
                    <div className="flex justify-center gap-1 text-c3 mt-5">
                        <span>Not a member yet?</span>
                        <Link
                            href="/register"
                            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
