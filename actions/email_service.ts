"use server";

import React from "react";
import { Resend } from "resend";
// import { validateString, getErrorMessage, isValidEmail } from "@/lib/utils";
import ContactMeSection from "@/components/contac_me";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData | any) => {
  const name = formData?.name || "";
  const senderEmail = formData?.email || "";
  const message = formData?.message || "";

  // simple server-side validation
  // if (!validateString(senderEmail, 500) || !isValidEmail(senderEmail as string)) {
  //     return {
  //         error: "Invalid email! Please provide a valid email address.",
  //     };
  // }
  // if (!validateString(message, 5000)) {
  //     return {
  //         error: "Invalid message",
  //     };
  // }

  let data;
  try {
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "finoraisme@gmail.com",
      subject: "Message from contact form User",
      replyTo: senderEmail as string,
      react: React.createElement(ContactMeSection, {
        name: name as string || "rrrrrrr",
        message: message as string || "rrrrrrr",
        senderEmail: senderEmail as string || "rrrrrrr",
      }),
    });
  } catch (error: unknown) {
    throw new Error("nre dxtf=====");
  }

  return {
    data,
  };
};
