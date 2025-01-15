const fs = require("fs");
const path = require("path");

const jsonPath = "D:\\Work\\stephino.github.io\\potrivit\\main\\json";
const plugins = [
    "customizer-block-cf7",
    "pixmagix",
    "how-your-carbon-impact",
    "my-wp-photos",
    "plugin-compatibility",
    "ai-seo-translator",
    "fewer-tags",
    "qr-pay-gateway",
    "posts-from-phpbb",
    "pubjet",
    "staging-prevent-indexing",
    "human-bmi-calculator",
    "wpforms-lite",
    "jetpack",
    "wordpress-seo",
    "akismet",
    "woocommerce",
    "all-in-one-wp-migration",
    "classic-editor",
    "really-simple-ssl",
    "elementor",
    "litespeed-cache",
    "duplicate-post",
    "wordfence",
    "wp-mail-smtp",
    "updraftplus",
    "all-in-one-seo-pack",
    "google-analytics-for-wordpress",
    "google-site-kit",
    "duplicate-page",
    "insert-headers-and-footers",
    "advanced-custom-fields",
    "classic-widgets",
    "limit-login-attempts-reloaded",
    "tinymce-advanced",
    "mailchimp-for-wp",
    "redirection",
    "seo-by-rank-math",
    "regenerate-thumbnails",
    "better-search-replace",
    "cookie-law-info",
    "cookie-notice",
    "loginizer",
    "one-click-demo-import",
    "w3-total-cache",
    "wp-super-cache",
    "loco-translate",
    "optinmonster",
    "send-pdf-for-contact-form-7",
    "doliconnect",
    "flexible-coupons",
    "all-bootstrap-blocks",
    "woostify-sites-library",
    "wp-businessdirectory",
    "ameliabooking",
    "js-crop",
    "wc-planzer-shipping",
    "awesome-event-booking",
    "mpdf-addon-for-pdf-invoices",
    "woocommerce-order-product-count",
    "srs-player",
    "trackdesk-for-woocommerce",
    "quriobot",
    "timeline-feed",
    "aweos-dynamic-phone-number",
    "tims-nextcloud-sso-oauth2",
    "tinymce-advanced",
    "genesis-taxonomy-images",
    "contributor-notifications",
    "contentify-ai",
    "world-population-counter",
    "quick-event-calendar",
    "cellarweb-privacy-and-security-options",
    "presta-products",
    "simple-click-tracker-lite",
    "scroll-triggered-animations",
    "affilizz",
    "canadian-gst-calculator",
    "easy-facebook-likebox",
    "affiliates-for-woocommerce",
    "simple-job-board",
    "scottcart",
    "falang",
    "content-curation-tool-by-curatora-io"
];

const files = fs.readdirSync(jsonPath, { withFileTypes: true });

files.forEach(file => {
    const fullPath = path.join(jsonPath, file.name);
    if (!file.isDirectory()) {
        const fileData = JSON.parse(fs.readFileSync(fullPath).toString());
        const newData = fileData.filter(v => plugins.includes(v));
        console.log(newData);
        if (!newData.length) {
            fs.rmSync(fullPath);
        } else {
            fs.writeFileSync(fullPath, JSON.stringify(newData));
        }
    }
});
