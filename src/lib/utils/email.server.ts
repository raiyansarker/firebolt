import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { nanoid } from "nanoid";

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
		html: string;
		text?: string;
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

		return address.join(",");
	}

	if (destination.name) `${destination.name} <${destination.email}>`;
	return destination.email;
};

const sendMail = async (opts: SendMail) => {
	const { from, replyTo, to, subject, body } = opts;

	const message = new URLSearchParams();
	message.append("from", `${from?.name ?? "No Reply"} <${from?.email ?? env.MAIL_FROM}>`);
	message.append("to", getDestinationAddress(to));
	message.append("subject", subject);
	body.text && message.append("text", body.text);
	message.append("html", body.html);
	replyTo || (env.MAIL_REPLY_TO && message.append("h:Reply-To", replyTo ?? env.MAIL_REPLY_TO));
	/**
	 * Gmail and some other clients thread emails, this custom header would prevent that
	 * Ref: https://stackoverflow.com/a/25435722
	 */
	message.append("h:X-Entity-Ref-ID", nanoid());

	const res = await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
		method: "POST",
		body: message.toString(),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${btoa(`api:${env.MAILGUN_KEY}`)}`
		}
	});
	const json = await res.json();

	if (res.status !== 200) {
		console.log(json.message ?? "unknown mail api error");
		throw error(500, json.message ?? "unknown mail api error");
	}
};

export { sendMail };
