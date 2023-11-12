import { clsx, type ClassValue } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const production = process.env.NODE_ENV === "production";

/**
 * Get short name from a name
 * EG. Raiyan Sarker -> RS, Raiyan Siraj Akib -> RS, Raiyan -> RA
 */
export const getShortName = (name: string): string => {
	const words = name.split(" ");
	if (words.length === 1) {
		return `${name.substring(0, 2).toUpperCase()}`;
	}

	const shortName = words[0].substring(0, 1) + words[1].substring(0, 1);

	return shortName.toUpperCase();
};

/**
 * Typescript type to zod schema
 *
 * Source: https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbwF4F84DMoRHAREiAE1wFgAocmATzAFM4BJcAG1pFoDsYBnAHgFkitZgD44AXkTk4cANoBrWlTjAOcRVQjo4gwsIC6AWgD8ALjgBXDnvSrahOLQAeMToW46hzBUv3SZcMZwHBbMzI4ubh66wj5UfmQBAUFIAHQAWkQAcqHMAIYARqwAKjS0vGmZhADyYDDAEBx5zKV0FRlEreUx3hr6IgP+SeaVRLX1jc1d7VXTPXH9IkNw5iFhEa7W0V4LyykdhDlhhSVlM51n832DiQEjB3M71wDc5CivFGTOkLAYVgDGEzUoDArHYXAEXgkwVoADdaFARAAKACUUluUFoMAsUDUCGWAHdgDAABbmXjLGQAZX+JLYeQ2UUYLDYnB4kL0ojgADJ0UkkrIrPIOBACRwANJKFRqACiTn+zAsel4Gi0cBpdJAeQANOolGqeiJ9Ks4QiPvy4ChlsjKXBuLT6eYNfTlmjxGI0hACgArWiApH2zV5FHa-zvN7kcgAeijlm4eQA5rRyN9oPBqHQ4ABVbgInrQ-G3YCEczcGBQVQJ-z04DMUvlytwAA+wVy-ia7HrFY4VdutigZayeU7dobPf8-0xeVchAAgjBzAARafJshWz6p37-Rpl7O5qAAYSnrmdWuhILBbN41RAxN4ObzXl1uEntBXc5guGbeGLuAGqNSIlSSRQsZBrOs4DSMtuwTADwIAtZ8iKWhUVDW4O1oe5oMrVD-H7Qdh0wyDUmwntcLXFEPhTJwfnTMo9wRI831cAAFPIqGYCA8gcSQ0lUdAEV4DNaDVB9D2PWhTzyEQgA
 * Twitter: https://twitter.com/alexdotjs/status/1658409815536812032
 * Github: https://github.com/colinhacks/zod/issues/2084
 * Gist: https://gist.github.com/raiyansarker/9f6fd0a3c7ebb345b3218e6cd644ea08
 */
type ZodEnhanceType<Model> = {
	[key in keyof Model]-?: undefined extends Model[key]
		? null extends Model[key]
			? z.ZodNullableType<z.ZodOptionalType<z.ZodType<Model[key]>>>
			: z.ZodOptionalType<z.ZodType<Model[key]>>
		: null extends Model[key]
		? z.ZodNullableType<z.ZodType<Model[key]>>
		: z.ZodType<Model[key]>;
};

export function zodEnhanced<Model = never>() {
	return {
		with: <
			Schema extends ZodEnhanceType<Model> & {
				[unknownKey in Exclude<keyof Schema, keyof Model>]: never;
			}
		>(
			schema: Schema
		) => z.object(schema)
	};
}

export type InferPartialSelect<T> = {
	[K in keyof T]?: boolean;
};

export const serializeJson = (data: object) => {
	return encodeURI(JSON.stringify(data));
};

/**
 * Calls a promise and returns a tuple with the resolved value and null if the promise is resolved,
 * or null and the error constructor if the promise is rejected.
 *
 * @param promise The promise to be called.
 * @returns A tuple with the resolved value and null if the promise is resolved,
 * or null and the error constructor if the promise is rejected.
 */
export const call = async <T>(
	promise: Promise<T>
): Promise<[Awaited<T>, null] | [null, ErrorConstructor]> => {
	try {
		const result = await promise;
		return [result, null];
	} catch (error) {
		return [null, error as typeof Error];
	}
};

/**
 * Type that represents an object with the same properties as T.
 * This type is used to prettify the type of an object.
 *
 * @template T - The type of the object to prettify.
 */
export type Prettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};
