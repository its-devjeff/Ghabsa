import React, { useState } from 'react';
import PageShell from '../../Components/PageShell/PageShell';
import './ContactUs.css';

/* This page used to read its values straight out of the DOM with
   getElementById, had no validation, and reported both success and failure
   through window.alert, which blocks the page and reads like a browser
   warning rather than a reply from the association. It is now an ordinary
   controlled form that reports its status in place. */

const CHANNELS = [
  {
    label: 'General enquiries',
    detail: 'Membership, events, and anything about the association.',
    value: 'ug.ghabsa@gmail.com',
  },
  {
    label: 'Website and IT',
    detail: 'Broken pages, sign-in trouble, or corrections to what is published.',
    value: 'ghabsaugit@gmail.com',
  },
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ghana-biochemistry-students-association-ghabsa-ug/' },
  { label: 'Instagram', href: 'https://instagram.com/ghabsa_ug?igshid=NTc4MTIwNjQ2YQ==' },
  { label: 'X', href: 'https://twitter.com/GHABSA_UG?s=09' },
  { label: 'YouTube', href: 'https://youtube.com/@GHABSAUG-li4bd' },
];

const EMPTY = { name: '', email: '', subject: '', message: '' };

const ContactUs = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const found = {};
    if (!values.name.trim()) found.name = 'Tell us who you are.';
    if (!values.email.trim()) found.email = 'We need an address to reply to.';
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      found.email = 'That does not look like an email address.';
    }
    if (!values.subject.trim()) found.subject = 'Give the message a subject.';
    if (!values.message.trim()) found.message = 'The message is empty.';
    return found;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    fetch('/api/mailer/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Request failed');
        setValues(EMPTY);
        setStatus('sent');
      })
      .catch(() => setStatus('failed'));
  };

  return (
    <PageShell
      title='Contact us'
      intro='Questions, corrections, or anything you want the association to know.'
      wide
    >
      <div className='Contact'>

        <section className='Contact-form-panel' data-reveal>
          <h2 className='Contact-heading'>Send a message</h2>
          <p className='Contact-note'>
            Messages reach the executive committee. Expect a reply within a few
            working days.
          </p>

          <form className='Contact-form' onSubmit={handleSubmit} noValidate>
            <div className='Contact-field'>
              <label htmlFor='c-name'>Name</label>
              <input
                id='c-name'
                type='text'
                value={values.name}
                onChange={update('name')}
                placeholder='Ama Mensah'
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className='Contact-error'>{errors.name}</span>}
            </div>

            <div className='Contact-field'>
              <label htmlFor='c-mail'>Email</label>
              <input
                id='c-mail'
                type='email'
                value={values.email}
                onChange={update('email')}
                placeholder='you@example.com'
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className='Contact-error'>{errors.email}</span>}
            </div>

            <div className='Contact-field'>
              <label htmlFor='c-subject'>Subject</label>
              <input
                id='c-subject'
                type='text'
                value={values.subject}
                onChange={update('subject')}
                placeholder='Internship letter enquiry'
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <span className='Contact-error'>{errors.subject}</span>}
            </div>

            <div className='Contact-field'>
              <label htmlFor='c-message'>Message</label>
              <textarea
                id='c-message'
                rows='7'
                value={values.message}
                onChange={update('message')}
                placeholder='What would you like to tell us?'
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <span className='Contact-error'>{errors.message}</span>}
            </div>

            <div className='Contact-actions'>
              <button
                className='Contact-submit'
                type='submit'
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending' : 'Send message'}
              </button>

              {status === 'sent' && (
                <p className='Contact-status Contact-status--good' role='status'>
                  Thank you. Your message is on its way.
                </p>
              )}
              {status === 'failed' && (
                <p className='Contact-status Contact-status--bad' role='alert'>
                  The message could not be sent. Please write to us at{' '}
                  <a href='mailto:ug.ghabsa@gmail.com'>ug.ghabsa@gmail.com</a> instead.
                </p>
              )}
            </div>
          </form>
        </section>

        <aside className='Contact-aside' data-reveal>
          <section className='Contact-block'>
            <h2 className='Contact-heading'>Write to us directly</h2>
            <ul className='Contact-list'>
              {CHANNELS.map((channel) => (
                <li className='Contact-item' key={channel.value}>
                  <span className='Contact-item-label'>{channel.label}</span>
                  <a className='Contact-item-value' href={`mailto:${channel.value}`}>
                    {channel.value}
                  </a>
                  <span className='Contact-item-detail'>{channel.detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className='Contact-block'>
            <h2 className='Contact-heading'>Find us</h2>
            <address className='Contact-address'>
              Department of Biochemistry, Cell and Molecular Biology<br />
              School of Biological Sciences<br />
              College of Basic and Applied Sciences<br />
              University of Ghana, Legon<br />
              Accra, Ghana
            </address>
          </section>

          <section className='Contact-block'>
            <h2 className='Contact-heading'>Follow the association</h2>
            <ul className='Contact-socials'>
              {SOCIALS.map((social) => (
                <li key={social.href}>
                  <a
                    className='Contact-social'
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>

      </div>
    </PageShell>
  );
};

export default ContactUs;
