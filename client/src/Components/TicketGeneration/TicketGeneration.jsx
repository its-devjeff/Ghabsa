import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './TicketGeneration.css';

const TicketGenerationForm = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [tableName, setTableName] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [ticketCode, setTicketCode] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');

  const generateTicketCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const generatedTicketCode = generateTicketCode();
      setTicketCode(generatedTicketCode);

      const response = await axios.post('/api/ticket/newTicket', {
        name,
        contact,
        email,
        tableName,
        amountPaid,
        ticketCode: generatedTicketCode,
      });

      const qrCodeImageUrl = response.data.qrCodeImageUrl;
      setQrCodeImageUrl(qrCodeImageUrl);

      console.log('Ticket generated:', response.data);
    } catch (error) {
      console.error('Failed to generate ticket:', error.response.data);
    }
  };

  const downloadTicket = () => {
    const qrCodeCanvas = document.getElementById('qr-code-canvas');
    const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = 'ticket.png';
    link.click();
  };

  return (
    <div className="Ticket-wrapper">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Table Name"
          required
        />
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="Amount Paid"
          required
        />

        <button className="cbtn green" type="submit">Generate Ticket</button>
      </form>

      {ticketCode && (
        <div className="">
          <p className="ticket-code">Ticket Code: {ticketCode}</p>
          <QRCode id="qr-code-canvas" value={ticketCode} size={256} includeMargin={true} />
          <button className="cbtn black" onClick={downloadTicket}>Download Ticket</button>
        </div>
      )}

      {qrCodeImageUrl && (
        <div>
          <p>QR Code Image URL: {qrCodeImageUrl}</p>
        </div>
      )}
    </div>
  );
};

export default TicketGenerationForm;
