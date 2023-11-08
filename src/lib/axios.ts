import axios from "axios";
import { base } from "$app/paths";

const api = axios.create({
	baseURL: `${base}/api`,
	withCredentials: true,
	headers: {
		"X-Fetch-Source": "client"
	}
});

export { api };
