import React, { useState } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@nextui-org/modal";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Spinner from "../Spinner/Spinner";
import {otpGenerator, otpVerifier} from "@/app/api/emailGenerator/emailGenerator";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Auth = (props: Props) => {
  
type Login={
  email: string;
}

const [loginData, setLoginData] = useState<Login>({
  email: '',
})

const [inputClicked, setInputClicked] = useState<boolean>(false);

const [loginClicked, setLoginClicked] = useState<boolean>(false);

const [enteredOTP,setEnteredOTP] = useState<string>("");

const [incorrectOTP, setIncorrectOTP] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              email: user.email,
              name: user.displayName,
              profilePic: user.photoURL,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            email: user.email,
            name: user.displayName,
            profilePic: user.photoURL,
            createdAt: serverTimestamp(),
          },
        });
      }

      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          profilePic: user.photoURL ?? "",
        })
      );
      props.onClose();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <Modal 
      size="sm"
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}></div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                  setLoginClicked(false); 
                  setInputClicked(false);
                  setLoginData({email:""});
                  setEnteredOTP("");
                  setIncorrectOTP(false);
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>Welcome</div>
              {!loginClicked && <p className={styles.text}>Let&apos;s Create Your Account</p>}

              {loading ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <Spinner />
                  </div>
                  <div className={styles.buttonText}>Signing in</div>
                </div>
              ) : (
                <>
                <div>
                  {!loginClicked && <input className={styles.inputField}
                    name="email"
                    type="email"
                    placeholder="Continue with email"
                    value={loginData.email}
                    onChange={(e) => {setLoginData({ ...loginData, email: e.target.value });
                                      setInputClicked(true)}}
                    autoComplete="off"
                  />}
                  {
                    loginClicked && <h4 className={styles.text} >Verification code sent to <i>{loginData.email}</i></h4>
                  }
                  {inputClicked && <>{ !loginClicked &&<button 
                                        onClick={()=>{
                                          setLoginClicked(true); 
                                          otpGenerator(loginData.email); 
                                          }} 
                                        className={styles.button}>
                                          Continue with email
                                      </button>}</>}
                  {loginClicked && 
                  <>
                    <input  className={styles.inputField} 
                    name="otpInput" 
                    type="text" 
                    placeholder="enter verifying code" 
                    onChange={(e) => setEnteredOTP(e.target.value)} 
                    maxLength={6} />
                    <button 
                        onClick={()=>{
                            otpVerifier(enteredOTP).then((verified)=>{
                              if(verified){
                                console.log("otp correct");
                                dispatch(setAuthState(true));
                                dispatch(setUserDetailsState({
                                  uid:"",
                                  email: loginData.email,
                                  name: (loginData.email).split("@")[0],
                                  profilePic: "",
                                }));
                                setLoading(true);
                                onClose();
                              }else{
                                console.log("incorrect otp");
                                setEnteredOTP("");
                                setIncorrectOTP(true);
                              }
                            })
                          }} 
                        className={styles.button}>
                          Verify
                    </button>
                    {incorrectOTP && <p className={styles.incorrectOTP}>Incorrect OTP</p>}
                    <button className={styles.resendOTP} onClick={()=>otpGenerator(loginData.email) }>Resend OTP</button>
                  </>
                  }
                </div>
                <h3 className={styles.centerText}>Or</h3>
                <div className={styles.button} onClick={handleAuth}>
                  <Image
                    src={"/svgs/Google.svg"}
                    alt={"Google"}
                    width={24}
                    height={24}
                  />
                  <div className={styles.buttonText}>Continue with Google</div>
                </div>
                </>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Auth;
