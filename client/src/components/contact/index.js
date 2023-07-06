import { useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();

  const sendmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_jgon9td",
        "template_0p5847c",
        form.current,
        "YXcze82n4-w8Pa6iM"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };

  return (
    <>
      <div>
        <form ref={form} onSubmit={sendmail}>
          <input type="text" placeholder="name" />
          <input type="email" placeholder="email" />
          <input type="text" placeholder="subject" />
          <textarea></textarea>
          <button type="submit">send message</button>
        </form>
      </div>
    </>
  );
};
export default Contact;
