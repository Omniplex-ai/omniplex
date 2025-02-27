
var generatedOTP=0;
const otp = Math.floor(Math.random()*1000000);//generates a6 digit OTP randomly
export const otpGenerator = async (inputEmail) => {
	generatedOTP=otp;
	const url = 'https://send-bulk-emails.p.rapidapi.com/api/send/otp/mail';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
		'x-rapidapi-host': 'send-bulk-emails.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		subject: 'Verification OTP',
		from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
		to: inputEmail,
		senders_name: 'omniplex',
		body: ('Your OTP is '+generatedOTP)
	})
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
}

export const otpVerifier = async (enteredOTP)=>{
	try {
		if(enteredOTP === generatedOTP.toString()){
			return true;
		}
		else{
			return false;
		}
	} catch (error) {
		console.log("error in otpVerifier: ",error.message);
	}
}