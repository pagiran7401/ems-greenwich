import QRCode from 'qrcode';

export const generateQRDataURL = async (bookingId: string): Promise<string> => {
  const payload = JSON.stringify({ bookingId, app: 'EVENTO' });
  return QRCode.toDataURL(payload, {
    width: 250,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });
};

export const downloadQRCode = async (bookingId: string, eventName: string) => {
  const dataUrl = await generateQRDataURL(bookingId);
  const link = document.createElement('a');
  link.download = `evento-ticket-${bookingId.slice(-8)}.png`;
  link.href = dataUrl;
  link.click();
};
