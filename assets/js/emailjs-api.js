(function() {
  emailjs.init("user_jkNTp7DNXkVvsWeNh9yY6");
  console.log("emailjsinit");
})();

const emailjsSend = ({ templateParams }, cb) => {
  emailjs.send("service_fd3ljqt", "template_iglh7lf", templateParams).then(
    response => {
      cb({ isSuccess: true, email: templateParams.to_email, msg: "" });
    },
    error => {
      cb({ isSuccess: false, email: templateParams.to_email, msg: error });
    }
  );
};
