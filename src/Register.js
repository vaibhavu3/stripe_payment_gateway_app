import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Auth } from 'aws-amplify';


const CUSTOMER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const DESCRIPTION_REGEX = /^[A-Za-z][A-z0-9-_]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
const CUSTOMER_REGISTER_URL = 'https://x5xlxm3xnl.execute-api.us-east-1.amazonaws.com/v1/customer/create';

const Register = () => {
    const customerRef = useRef();
    const errRef = useRef();

    const [customer, setCustomer] = useState('');
    const [validCustomerName, setValidCustomerName] = useState(false);
    const [customerFocus, setCustomerFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [description, setDesciption] = useState('');
    const [validDescription, setValidDescription] = useState(false);
    const [descriptionFocus, setDescriptionFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        customerRef.current.focus();
    }, [])


    useEffect(() => {
        const result = CUSTOMER_REGEX.test(customer);
        console.log(result);
        console.log(customer);
        setValidCustomerName(result);
    }, [customer])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = DESCRIPTION_REGEX.test(description);
        console.log(result);
        console.log(description);
        setValidDescription(result);
    }, [description])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [customer, email, description, pwd, matchPwd])


    const handleSubmit = async (e) => {
        e.preventDefault();

        // If button enabled with JS hack
        const v1 = CUSTOMER_REGEX.test(customer);
        const v2 = PWD_REGEX.test(pwd);
        const phone_number = "1234567890";
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        console.log(customer, pwd);

        try {
            const { user } = await Auth.signUp({
                email,
                pwd,
                attributes: {
                    customer,          // optional
                    phone_number: "1234567890",   // optional - E.164 number convention
                    // other custom attributes 
                }
            });
            console.log(user);

            const response = await axios.post(CUSTOMER_REGISTER_URL,
                JSON.stringify({ "customerName": customer, "password": pwd, "customerPhone": phone_number, "customerEmail": email, "description": description }),
            );
            console.log(response);
            // console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);

            //clear state and controlled inputs
            setCustomer('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed - '+err);
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="customerName">
                            Customer Name:
                            <span className={validCustomerName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validCustomerName || !customer ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            ref={customerRef}
                            autoComplete="off"
                            onChange={(e) => setCustomer(e.target.value)}
                            required
                            aria-invalid={validCustomerName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setCustomerFocus(true)}
                            onBlur={() => setCustomerFocus(false)}
                        />
                        <p id="uidnote" className={customerFocus && customer && !validCustomerName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="email">
                            Email:
                            <span className={validEmail ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid email address.<br />
                            It should be in abc@xyz.com.<br />
                        </p>


                        <label htmlFor="description">
                            Description:
                            <span className={validDescription ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validDescription || !description ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="description"
                            onChange={(e) => setDesciption(e.target.value)}
                            required
                            aria-invalid={validDescription ? "false" : "true"}
                            aria-describedby="descriptionnote"
                            onFocus={() => setDescriptionFocus(true)}
                            onBlur={() => setDescriptionFocus(false)}
                        />
                        <p id="descriptionnote" className={descriptionFocus && description && !validDescription ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 20 characters.<br />
                            Please enter valid description.<br />
                        </p>



                        <label htmlFor="password">
                            Password:
                            <span className={validPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validCustomerName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>

                    <p>
                        Already registered? <br />
                        <span className="line">
                            <a href="#">Sign In</a>
                        </span>
                    </p>

                </section>
            )}
        </>
    )
}

export default Register;