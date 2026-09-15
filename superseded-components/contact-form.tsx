"use client";

import { useState, type FormEvent } from "react";

export function ContactForm({
  email,
  label,
  placeholder,
  sendLabel,
}: {
  email: string;
  label: string;
  placeholder: string;
  sendLabel: string;
}) {
  const [value, setValue] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Let’s create a project");
    const body = encodeURIComponent(
      `Hello,\n\nI would like to talk about a project.\n\nMy email: ${value}\n`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }
  return (
    <form className="site-footer-contact-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="footer-email">
        {label}
      </label>
      <input
        id="footer-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="site-footer-contact-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="site-footer-contact-button">
        {sendLabel}
      </button>
    </form>
  );
}
