const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: process.env.EM_HOST,
	port: process.env.EM_PORT,
	secure: false,
	auth: {
		user: process.env.EM_USER,
		pass: process.env.EM_PASS
	}
});

transporter.verify((err, scc) => {
	if (err) console.error('Nodemailer Failed to init', err);
	else console.log('Nodemailer Successfully initiated', scc);
});

module.exports = function (to = '', subject = '', text = '') {
	if (!Boolean(to.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)))
		return console.log('unable to send mail:', { to, subject, text });
	transporter.sendMail({ from: process.env.EM_FROM, to, subject, text }, function (error, info) {
		if (error) console.log('error sending mail:', error);
		else console.log('email sent ok:', info);
	});
};