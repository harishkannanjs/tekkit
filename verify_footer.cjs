
const fs = require('fs');
const path = require('path');

const files = [
    "Vibe_Coding_Mastery.html",
    "apply-now.html",
    "contact.html",
    "courses.html",
    "index.html",
    "pricing.html",
    "privacy_policy.html",
    "terms_and_conditions.html",
    "waiting_page.html"
];

const basePath = "d:\\Develop\\Tekkit\\tekkit-main\\tekkit-main";

function verifyFooter(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return { success: false, message: "Could not read file" };
    }

    // Find the #brxe-byhlqf div
    const footerRegex = /<div id="brxe-byhlqf" class="brxe-div">([\s\S]*?)<\/div>\s*<\/div>/; // simplistic matching

    if (!content.includes('<div id="brxe-byhlqf" class="brxe-div">')) {
        return { success: false, message: "Footer container #brxe-byhlqf not found" };
    }

    const footerStart = content.indexOf('<div id="brxe-byhlqf" class="brxe-div">');
    const footerContent = content.substring(footerStart, footerStart + 2000); // Grab a chunk

    // Check for unique class/id in style to verify its our style
    if (!footerContent.includes('<style>')) {
        return { success: false, message: "Embedded <style> tag not found within/near #brxe-byhlqf" };
    }

    if (!footerContent.includes('flex-direction: column')) {
        return { success: false, message: "Style does not contain 'flex-direction: column'" };
    }

    if (!footerContent.includes('#footer-links-group')) {
        return { success: false, message: "Style does not contain rules for #footer-links-group" };
    }

    if (!footerContent.includes('<div id="footer-links-group">')) {
        return { success: false, message: "Div #footer-links-group not found" };
    }

    // Check if footer-links-group comes before contact link
    const groupIndex = footerContent.indexOf('<div id="footer-links-group">');
    const contactIndex = footerContent.indexOf('href="contact.html"');

    if (contactIndex === -1) {
        return { success: false, message: "Contact link not found" };
    }

    if (groupIndex > contactIndex) {
        return { success: false, message: "Contact link appears before footer-links-group (unexpected order)" };
    }

    // Check for closing style tag
    if (!footerContent.includes('</style>')) {
        return { success: false, message: "Closing </style> tag not found" };
    }

    return { success: true, message: "Verified" };
}

console.log("Verifying footer structure...");
let allPassed = true;

files.forEach(filename => {
    const fullPath = path.join(basePath, filename);
    const result = verifyFooter(fullPath);

    if (result.success) {
        console.log(`[PASS] ${filename}`);
    } else {
        console.log(`[FAIL] ${filename}: ${result.message}`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log("\nAll files verified successfully!");
} else {
    console.log("\nSome files failed verification.");
}
