'use strict';
module.exports=async(req,res)=>{res.setHeader('Cache-Control','no-store');return res.status(200).json({ok:true,enabled:!!process.env.GEMINI_API_KEY,provider:process.env.GEMINI_API_KEY?'Gemini':null,externalProcessing:!!process.env.GEMINI_API_KEY,voiceAvailable:!!process.env.GEMINI_API_KEY})};
