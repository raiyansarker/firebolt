import { env } from "$env/dynamic/private";
import formData from "form-data"; // this package is used by mailgun.js to make the package universal
import Mailgun from "mailgun.js";
import { nanoid } from "nanoid";
import { call } from ".";

type SendMail = {
	from?: {
		name?: string;
		email: string;
	};
	replyTo?: string;
	to:
		| {
				name?: string;
				email: string;
		  }
		| {
				name?: string;
				email: string;
		  }[];
	subject: string;
	body: {
		html?: string;
		text: string;
	};
};

/**
 * Returns the destination email address(es) in the correct format for sending an email.
 *
 * @param destination - The destination email address(es).
 * @returns The destination email address(es) in the correct format.
 */
const getDestinationAddress = (destination: SendMail["to"]) => {
	if (Array.isArray(destination)) {
		const address: string[] = [];
		for (const value of destination) {
			if (value.name) {
				address.push(`${value.name} <${value.email}>`);
			}

			address.push(value.email);
		}

		return address;
	}

	if (destination.name) `${destination.name} <${destination.email}>`;

	return destination.email;
};

const sendMail = async (opts: SendMail) => {
	const mailgun = new Mailgun(formData);
	const email = mailgun.client({
		username: "api",
		key: env.MAILGUN_KEY
	});

	const { from, replyTo, to, subject, body } = opts;

	const message = email.messages.create(env.MAILGUN_DOMAIN, {
		from: `${from?.name} ?? No Reply <${from?.email ?? env.MAIL_FROM}>`,
		to: getDestinationAddress(to),
		subject,
		text: body.text,
		html: body.html,
		"h:Reply-To": replyTo ?? env.MAIL_REPLY_TO,
		/**
		 * Gmail and some other clients thread emails, this custom header would prevent that
		 * Ref: https://stackoverflow.com/a/25435722
		 */
		"h:X-Entity-Ref-ID": nanoid()
	});

	return await call(message);
};

export { sendMail };
