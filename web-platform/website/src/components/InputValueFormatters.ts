import React, { useEffect } from "react";

export interface IFormatter {
	getEditableValue(formattedValue: string): string;
	getFormattedValue(editableValue: string): string;
}

export function useFormatter(
	ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>,
	formatter: IFormatter
) {
	useEffect(() => {
		const current = ref.current;

		if (!current) {
			return;
		}

		const onFocusHandler = () => onFocus(current, formatter);
		const onFocusLostHandler = () => onFocusLost(current, formatter);

		current.addEventListener("input", onFocusHandler);
		current.addEventListener("focus", onFocusHandler);
		current.addEventListener("blur", onFocusLostHandler);

		onFocusLostHandler();

		return () => {
			current.removeEventListener("input", onFocusHandler);
			current.removeEventListener("focus", onFocusHandler);
			current.removeEventListener("blur", onFocusLostHandler);
		};
	}, [ref.current]); // eslint-disable-line react-hooks/exhaustive-deps
}

function onFocus(
	inputElement: HTMLInputElement | HTMLTextAreaElement,
	formatter: IFormatter
) {
	inputElement.value = formatter.getEditableValue(
		(inputElement.value && inputElement.value.toString()) || ""
	);
}

function onFocusLost(
	inputElement: HTMLInputElement | HTMLTextAreaElement,
	formatter: IFormatter
) {
	inputElement.value = formatter.getFormattedValue(
		(inputElement.value && inputElement.value.toString()) || ""
	);
}

const toCurrency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const numberRegEx = /^\d/;

export const NumberFormatter: IFormatter = {
	getEditableValue(formattedValue: string) {
		return (formattedValue || "")
			.split("")
			.filter((a) => numberRegEx.test(a))
			.join("");
	},

	getFormattedValue(editableValue: string) {
		const value = this.getEditableValue(editableValue);

		const intValue = parseInt(value, 10);

		return Number.isInteger(intValue) ? intValue.toString() : "";
	},
};

export const CurrencyFormatter: IFormatter = {
	getEditableValue: NumberFormatter.getEditableValue,

	getFormattedValue(editableValue: string) {
		const numStringValue = NumberFormatter.getFormattedValue(editableValue);

		return numStringValue
			? toCurrency.format(parseInt(numStringValue, 10) || 0)
			: "";
	},
};
