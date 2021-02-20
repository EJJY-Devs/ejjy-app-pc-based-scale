import { message } from 'antd';
import qz from 'qz-tray';

const PAPER_MARGIN = 0.2; // inches
const PAPER_WIDTH = 3; // inches
const PRINTER_MESSAGE_KEY = 'configurePrinter';
const SI_MESSAGE_KEY = 'SI_MESSAGE_KEY';
const PRINTER_NAME = 'EPSON TM-U220 Receipt';
// const PRINTER_NAME = 'Microsoft Print to PDF';

const configurePrinter = (callback = null) => {
	if (!qz.websocket.isActive()) {
        // Authentication setup
        qz.security.setCertificatePromise(function (resolve, reject) {
            //Alternate method 2 - direct
            resolve("-----BEGIN CERTIFICATE-----\n" + 
                "MIIC2DCCAcACCQDbsDMxRWeypzANBgkqhkiG9w0BAQsFADAtMQ0wCwYDVQQKDARF\n" + 
                "SkpZMQ0wCwYDVQQLDARFSkpZMQ0wCwYDVQQDDARFSkpZMCAXDTIxMDIxODA3MzEx\n" + 
                "MFoYDzIwNTIwODEzMDczMTEwWjAtMQ0wCwYDVQQKDARFSkpZMQ0wCwYDVQQLDARF\n" + 
                "SkpZMQ0wCwYDVQQDDARFSkpZMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\n" + 
                "AQEAx1weEomPtIi4ETBWqcSjzolUQVtsOz1mp8K91tVSImZslXG7t0mplVarc4pN\n" + 
                "w7o1hD4hmn7rag3JhLOJrkkZ04WQUzKpRrkUnuVf26hxjqoKjSP3gUk22j3xuYMR\n" + 
                "DfBN9Qvy7qs9XqR9JT7KCce3bgxZpUdoOfK2N6scZjCkNsH1zqM1so/aDEkAF2He\n" + 
                "2BpMg9xorWbmDA0Qe2HF3fslCbTyzAa9qq7y3Rw/yDhaQ7F0l/7D4hBRg/3WGrjv\n" + 
                "wUcm7OLaC8hAcP8V/Y1is2+M8TxQZ5BMZR95CSw3qyGN++Mw2lvOKBE/cKmTs64x\n" + 
                "oMn6wE66EGsJJkxGOaZy3Aq+jwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCRRS9H\n" + 
                "M1g+nOarunY+MrnjBwtnUFdCZKJDzetgPwDfTTIuY7k0mx4Mm0aNjyfz2OKcnJoi\n" + 
                "GcnqjzPjbv3I2+3sbc4muItLkV5PyRP8SVUcjUWD/ql30DXLpAmmxD2JvVtu0xv5\n" + 
                "+CMF/mrkGmU7/Oos4D7AS5lHx4P/73JCcyeVOwIj4JKzCrZPJ/ot4ECdtQRUKHP6\n" + 
                "JU34uiv9UeGP5hwPh6/an9YkmBQNtLNBOYgBg33OCkYEsosJxIeYHgZ/hP01beOr\n" + 
                "vVdcs+Swa/Q6nLkclLl53/r3sX3ypKzORuLo+F7I/Z8zbtm1c6jfmyCn5qNNygVe\n" + 
                "jl3kpz8ugDyp9FyV\n" + 
                "-----END CERTIFICATE-----"
            );
        });
	    qz.security.setSignatureAlgorithm('SHA512'); // Since 2.1
    
		message.loading({
			content: 'Connecting to printer...',
			key: PRINTER_MESSAGE_KEY,
			duration: 0,
		});

		qz.websocket
			.connect()
			.then(() => {
				message.success({
					content: 'Successfully connected to printer: .',
					key: PRINTER_MESSAGE_KEY,
				});

				callback?.();
			})
			.catch((err) => {
				message.error({
					content: 'Cannot register the printer.',
					key: PRINTER_MESSAGE_KEY,
				});
				console.error(err);
			});
	}
};

export default configurePrinter;
