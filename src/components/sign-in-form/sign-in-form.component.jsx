import { useState, useContext } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { 
    signInWithGooglePopup,
    createUserDocumentFromAuth,
    signInAuthUserWithEmailAndPassword     
} from '../../utils/firebase/firebase.utils'

import  { UserContext } from '../../contexts/user.context'


import './sign-in-form.styles.scss'

const defaultFormFields = {
    email: '',
    password: ''
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }


    const  signInWithGoogle = async() => {
        const {user} = await signInWithGooglePopup();
        await createUserDocumentFromAuth(user);
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const {user} = await signInAuthUserWithEmailAndPassword (email, password);
            setCurrentUser(user);
            
            resetFormFields();

        } catch(error) {
            switch(error.code) {
                case 'auth/wrong-password':
                    alert("Incorrect password or email");
                    break
                case 'auth/user-not-found':
                    alert('no user associated with this email');
                    break
                default:
                    console.log(error)
            }
        }  
    }

    
    return (
        <div className='sign-in-container'>
            <h2> I already have an account</h2>
            <span> Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput 
                    label="email"
                    type="email" 
                    required 
                    onChange={handleChange} 
                    name="email"
                    value={email}
                />
                <FormInput 
                    label="password"
                    type="password" 
                    required 
                    onChange={handleChange} 
                    name="password"
                    value={password}
                    />
                <div className='buttons-container'>
                    <Button type="submit">Sign In</Button>
                    <Button type="button" buttonType="google" onClick={signInWithGoogle}>Google sign in</Button>
                </div>
                
            </form>
        </div>
    )
}



export default SignInForm;


