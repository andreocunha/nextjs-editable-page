import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async (req, res) => {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSoFX7e7JFp/vP\nqtO8p68tDb74uOhvPYJgrRUhhKLbYtjCAZnFV+utjU1LTRUjBemCv5ldXBHcSU+J\nMDJGVWk6J2xhPVy8GaMntSrXPBV/1OWDyu/rOLtWkU1/ok/B5LQp7vrVjKz2MYB8\noeFGvgTE8d5nFAa2f0NV+w3bClE5WJr5BvTiHQXdi3eEOmGFeTVw8YTqkziTEPTT\nlfwoDUiyFP7uSQsEi1CCJCuLg3xczdOYX5aG52e2/bd4sk7mT0BXKebIEjJqbbe7\nQZXqdQWPuZ3IgMSgbx8lxJJGrHnmkClRc4PqieNi8A7CAz7fY828kfj/KcqSlH4i\nJrUrr+W9AgMBAAECggEAFay1mSEjbLrqH+bQ5EyQuiMT4wuJHIHmByl+0VTHMua3\n7mczK8y/44iwRNyGWTDeCxG3TOmNIFhb9VvWYAxEgQVj4Yn4bpExoO8zKob7Z0lO\n4OkRBzSnM3hI5wBU3u99FyJ4b4nwkCIoLARNW1o/3+cgfnH46LsDoVmlJjHZE5YF\nYrvkGn6hf7n5MFAHTh71M/t3HW1knfUVdklqcp8evbKk1RMQBN+Vwd2FkCr28bxX\n5yXSt8XPiB5kDQU3fCIvHvwwxKymWO3Vx8nvTRLuhAnFPSRsMPMTacyCVRK/VQ+0\nL3GHWXfvrHguTiAtquiLm66q9QBhh2XLEa7S73j4pwKBgQDGc2KgeZJIBGiOqRcr\n6VAgN94FbrI2jH+tu4X1X10Rjw+jJDiKo8A5/rctrGBEjX5bw9Uf1pk2fP+3jlip\nEzaH9ApStJp1Y7/BpVOZOBqk1yFfR+i+ClivYcrxZq9IlQ83M2XHcdntUn0k2XAm\n9W+uNEHrJ3yICw48c8C/Hj/HqwKBgQC9JZokj3AH1TaHJZRcs6HOJ59ahK/g4kxl\nAGggFJQvxOGA6jjQiQpDE2zdqLk7zJA9m4yzOKBW2UCv7fsfEOQgw/Zd0yx4jFzY\nMiHtYPrwAagI1e3FJf2WbI8nlj+NboswDa/EFPYHBvG00TKigXomWlbdFYYuWdzN\nqvLBF/QANwKBgBBI87T7hPeH9RSP56jg0oRyUTPc657yVJ/rHYkPNFH2jW/zzvgB\njAq2Tk3fMV8uxUm+fkTIlXYVN97WPYxSWU06x4YV7/7mGpxHdt7B7d3NEZ4CBqVh\nr/lkawT4SjYIlWEQRK/jNeD1vfNCLKPlzC5dd3NWoC+ByL9JOG32i4FVAoGAWtiV\nmVu/TjPM1cpp4MByRaboNbynENcAJD62xDm+Ftd0C8vzb81yPVc2IZxpI1yUJtLw\nGCBpem0sUZN22qvtNgOI7/V+VYPtD/W8L9w1ilLxVxUQ93DQxI/tjfDvI0nl1jWs\npvv+Us+2Bce4jy6q8YLQV61/3gFROQMTR0Tu768CgYAT9NdybeuUS7uZTCISreIS\nsoY8Ac/4/ZuOMcHOEoPldLwd5my0eJFigDi5gpar2fyEa8EcRn6n96QbSRxSWBcV\nJ+D9fsipXzDO/uM2iVmPAmucpa8Y/Gts/Hn/665akQGFMnAaZx9xg4GSDanHhWnk\noWXQbKhSnGdJ7oLKCQJhew==\n-----END PRIVATE KEY-----\n",
        client_email: process.env.CLIENT_EMAIL,
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const { method } = req;

    if (method === 'POST') {
        await sheet.addRow(req.body);
        return res.status(200).send('Salvo!');
    }
    else if (method === 'PUT') {
        const row = rows.filter(({ id, text, image }) => {
            return (id === req.body.id);
        })
        row[0].text = req.body.text;
        row[0].image = req.body.image;

        await row[0].save();
        return res.status(200).send('Salvo!');
    }
    else if( method === 'DELETE') {
        const row = rows.filter(({ id, text, image }) => {
            return (id === req.body.id);
        })
        await row[0].delete();
        return res.status(200).send('Deletado!');
    }

    const data = rows.map(({ id, text, image }) => {
        return {
            id,
            text,
            image
        };
    })

    res.status(200).send({
        title: doc.title,
        data
    });

}