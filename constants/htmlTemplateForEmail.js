exports.htmlEmailTemplate = {
    header: `        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;border-right: 2px solid #0e2369;  border-left: 2px solid #0e2369;">
    <tbody>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#0e2369" color="#cee222" style="padding: 10px 0 10px 0;  color: #ffffff; font-size: 30px; ">
                                <span style="color: #a9144f">LETS</span> <span style="color: #a0a914">RUN</span>
                                <br>
                                <span style="color: #a9141d">RUN</span> <span style="color: #97a914">FOR</span>
                                <span style="color: #a9144f">YOUR</span> <span style="color: #14a9a4">LIVES</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#0e2369"  style="width: 33%; font-size: 30px; ">
                                <a style="text-decoration:none; color: #a0a914;" href="http://localhost:4200">Home page</a>
                            </td>
                            <td align="center" bgcolor="#0e2369" style="width: 33%; font-size: 30px; ">
                                <a style="text-decoration:none; color: #a0a914;"  href="https://let-run-today.tk/events">Events list</a>
                            </td>
                            <td align="center" bgcolor="#0e2369" style="width: 33%; padding: 5px 0 5px 0; font-size: 30px; ">
                                <a style="text-decoration:none; color: #a0a914;"  href="https://let-run-today.tk/forum">Forum</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 10px 0 10px 0; font-size: 2rem;">`,

    middle: `               </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                        <tbody>
                            <tr>
                                <td align="center" bgcolor="#ffffff" style="padding: 10px 0 10px 0; font-size: 2rem;">`,

                                quoter: `                   </td>
                            </tr>
                         </tbody>
                    </table>

                </td>
        </tr>
        <tr>
            <td>
                <table width="95%" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 40px;">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#0e2369" style="color: #a0a914;  padding: 10px 10px 10px 0; font-size: 1.5rem;">`,

    footer: `               </td>
                        </tr>
                    </tbody>
                 </table>

            </td>
        </tr>
            
            <tr>
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
                        <tbody>
                             <tr>
                                <td align="right" bgcolor="#ffffff" style="padding: 10px 10px 10px 0; font-size: 2rem;">
                                    <p> You'r LetsRun team!</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse">
<tbody>
    <tr>
        <td align="center" bgcolor="#0e2369" style="padding: 20px 0 0px 0;">
            <a  style="color:#a0a914; width: 40px;"  href=""><img style="width: 40px; margin: 0 10px 0 10px;" src="cid:facebook@logo"
                    alt="Facebook Logo"></a>
            <a style="color:#a0a914; width: 40px;"  href=""><img style="width: 40px; margin: 0 10px 0 10px;" src="cid:instagram@logo"
                    alt="Twitter Logo"></a>
            <a style="color:#a0a914; width: 40px;"  href=""><img style="width: 40px; margin: 0 10px 0 10px;" src="cid:twitter@logo"
                    alt="Instagram"></a>
        </td>
    </tr>
    <tr>
        <td align="left" bgcolor="#0e2369" style="padding: 0 0 0 0;">
            <p style="color: #a0a914; font-size: 18px; margin-left: 10px; margin-bottom: 0; ">Message
                was send from: <a style="color: #2dc394; font-size: 18px;  text-decoration:none; cursor: pointer"
                    href="https://let-run-today.tk/">let-run-today.tk</a></p>
        </td>
    </tr>
    <tr>
        <td align="left" bgcolor="#0e2369" style="padding: 0 0 20px 0;">
            <p style="color: #a0a914; font-size: 18px; margin-left: 10px;">If you don't want to
                receive messages from us click <a style="color: #2dc394; font-size: 18px;  text-decoration:none;"
                    href="https://let-run-today.tk/">here</a> to unsubscribe!</p>
        </td>
    </tr>
</tbody>
</table>

</td>
</tr>

</tbody>

</table>`,
    attachmentsTemplate: [{
        filename: 'flogo-HexRBG-Wht-58.png',
        path: 'public/images/flogo-HexRBG-Wht-58.png',
        cid: 'facebook@logo'
    }, {
        filename: 'glyph-logo_May20162.png',
        path: 'public/images/glyph-logo_May20162.png',
        cid: 'instagram@logo'
    }, {
        filename: 'Twitter_Logo_WhiteOnBlue.png',
        path: 'public/images/Twitter_Logo_WhiteOnBlue.png',
        cid: 'twitter@logo'
    }]
}