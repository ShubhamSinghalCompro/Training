const short = require('short-uuid');
const URL = require("../models/url");
const handleGenerateNewShortUrl = async (req, res) => {
    const body = req.body;
    if(!body) {
        return res.status(400).json({
            success: false,
            message: "Url is required"
        });
    }
    const shortId = short.generate();

    const result = await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []
    });
    // return res.status(201).json({
    //     success: true,
    //     id: shortId
    // });

    return res.render("home", {
        success: true,
        id: shortId,
        result: result
    });
}

const handleGetAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    const result =await URL.findOne({ shortId});
    return res.status(200).json({
        success: true,
        totalVisits: result.visitHistory.length,
        analytics: result.visitHistory
    })

}


module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}