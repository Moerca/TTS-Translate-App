if (prosses.env.NODE_ENV !== 'production'){
    // dynamic import
    (async () => {
        const dotenv = await import ('dotenv');
        dotenv.config();
    })
}

// Serverless function
export default async function handler(req, res) {
    if(req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'});
    }

// get target language from body
const { text, target } = req.body;

if (!text || !target) {
    return res.status(400).json({error: 'Missing text or language'});
}

const apiKey = prosses.env.GOOGLE_TRANSLATE_API_KEY;
const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

try {
    const respinse = await fetch(apiUrl, {
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            q: text,
            target,
            format: 'text',
        }),
    });

    if(!Response.ok){
        const errorText = await Response.text();
        return res.status(Response.status).json({error: errorText})
    }

    const data = await Response.json();
    res.status(200).json(data);

    } catch (error) {
        console.error('Error in API call: ', error);
        res.status(500).json({error: 'Internal Server Error'})
    }
}