export async function handleVAlidateChirp(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            const bod = parsedBody.body;
            if (bod.length > 140) {
                res.header("Content-Type", "application/json");
                res.status(400).send(JSON.stringify({
                    error: "Chirp is too long",
                }));
                return;
            }
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify({
                valid: true,
            }));
        }
        catch (error) {
            res.status(400).send(JSON.stringify({
                error: "Something went wrong",
            }));
        }
    });
}
