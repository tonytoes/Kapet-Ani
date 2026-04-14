<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/config.php';
applyCors();

$db = new Database();
$conn = $db->connect();

function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
    ob_clean();
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit();
}

function ensureTable(): void
{
    global $conn;
    $conn->exec("
        CREATE TABLE IF NOT EXISTS website_content (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page VARCHAR(80) NOT NULL,
            section VARCHAR(120) NOT NULL,
            content_key VARCHAR(140) NOT NULL UNIQUE,
            title VARCHAR(255) NULL,
            subtitle VARCHAR(255) NULL,
            description TEXT NULL,
            cta_label VARCHAR(120) NULL,
            cta_link VARCHAR(255) NULL,
            image_name VARCHAR(255) NULL,
            image_type VARCHAR(80) NULL,
            image_blob LONGBLOB NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
}

function ensureHomeSeed(): void
{
    global $conn;
    $defaults = [
        ['home', 'hero', 'heroEyebrow', 'Est. 1996 · Filipino Heritage', null, null, null, null],
        ['home', 'hero', 'heroTitleLine1', 'From Filipino Hands', null, null, null, null],
        ['home', 'hero', 'heroTitleLine2', 'to global streets', null, null, null, null],
        ['home', 'hero', 'heroCtaLabel', 'Explore Our Products', null, null, 'Explore Our Products', '#featured'],
        ['home', 'hero', 'heroCtaLink', '#featured', null, null, null, '#featured'],
        ['home', 'featured', 'featuredSectionLabel', 'Featured Products', null, null, null, null],
        ['home', 'featured', 'featured1Image', null, null, null, null, null],
        ['home', 'featured', 'featured2Image', null, null, null, null, null],
        ['home', 'featured', 'featured1Name', 'Matcha Vanilla', null, null, null, null],
        ['home', 'featured', 'featured2Name', 'Ube Frappe', null, null, null, null],
        ['home', 'more', 'moreSectionLabel', 'More Products', null, null, null, null],
        ['home', 'more', 'more1Image', null, null, null, null, null],
        ['home', 'more', 'more2Image', null, null, null, null, null],
        ['home', 'more', 'more3Image', null, null, null, null, null],
        ['home', 'more', 'more4Image', null, null, null, null, null],
        ['home', 'more', 'more5Image', null, null, null, null, null],
        ['home', 'more', 'more6Image', null, null, null, null, null],
        ['home', 'more', 'more7Image', null, null, null, null, null],
        ['home', 'more', 'more8Image', null, null, null, null, null],
        ['home', 'more', 'more9Image', null, null, null, null, null],
        ['home', 'more', 'more1Name', 'Abaca Basket 1', null, null, null, null],
        ['home', 'more', 'more2Name', 'Abaca Basket 2', null, null, null, null],
        ['home', 'more', 'more3Name', 'Abaca Basket 3', null, null, null, null],
        ['home', 'more', 'more4Name', 'Rattan Basket', null, null, null, null],
        ['home', 'more', 'more5Name', 'Bamboo Basket', null, null, null, null],
        ['home', 'more', 'more6Name', 'Seagrass Basket', null, null, null, null],
        ['home', 'more', 'more7Name', 'Palm Leaf Coasters', null, null, null, null],
        ['home', 'more', 'more8Name', 'Banig Crossbody', null, null, null, null],
        ['home', 'more', 'more9Name', 'Clay Mug', null, null, null, null],
        ['home', 'voucher', 'vouchersSectionLabel', 'Product Vouchers', null, null, null, null],
        ['home', 'voucher', 'voucherImageMain', null, null, null, null, null],
        ['home', 'voucher', 'voucherImage2', null, null, null, null, null],
        ['home', 'voucher', 'voucherImage3', null, null, null, null, null],
        ['home', 'voucher', 'voucherTitle', 'ChoosDay Promo', null, null, null, null],
        ['home', 'voucher', 'voucherDesc', null, null, 'Tune in for the next ChoosDay Promo! (Tuesday 8:00–9:00 pm)', null, null],
        ['home', 'voucher', 'voucherCtaLabel', 'Start Shopping', null, null, 'Start Shopping', '#'],
        ['home', 'voucher', 'voucherCtaLink', '#', null, null, null, '#'],
        ['home', 'blogs', 'blogsSectionLabel', 'Lifestyle Stories', null, null, null, null],
        ['home', 'blogs', 'blog1Image', null, null, null, null, null],
        ['home', 'blogs', 'blog2Image', null, null, null, null, null],
        ['home', 'blogs', 'blog3Image', null, null, null, null, null],
        ['home', 'blogs', 'blog1Title', 'Health Check: why do I get a headache when I haven\'t had my coffee?', null, null, null, null],
        ['home', 'blogs', 'blog1Excerpt', null, null, 'It is a paradisematic country, in which roasted parts of sentences fly into your mouth.', null, null],
        ['home', 'blogs', 'blog1Date', 'October 9, 2018', null, null, null, null],
        ['home', 'blogs', 'blog2Title', 'How long does a cup of coffee keep you awake?', null, null, null, null],
        ['home', 'blogs', 'blog2Excerpt', null, null, 'It is a paradisematic country, in which roasted parts. Vel qui et ad voluptatem.', null, null],
        ['home', 'blogs', 'blog2Date', 'October 9, 2018', null, null, null, null],
        ['home', 'blogs', 'blog3Title', 'Recent research suggests that heavy coffee drinkers may reap health benefits.', null, null, null, null],
        ['home', 'blogs', 'blog3Excerpt', null, null, 'It is a paradisematic country, in which roasted parts of sentences fly into your mouth.', null, null],
        ['home', 'blogs', 'blog3Date', 'October 9, 2018', null, null, null, null],
    ];

    $stmt = $conn->prepare("
        INSERT INTO website_content (page, section, content_key, title, subtitle, description, cta_label, cta_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE content_key = content_key
    ");
    foreach ($defaults as $row) {
        $stmt->execute($row);
    }
}

function ensureProductSeed(): void
{
    global $conn;
    $defaults = [
        ['product', 'layout', 'allProductsLabel', 'All Products', null, null, null, null],
        ['product', 'layout', 'categoriesTitle', 'Categories', null, null, null, null],
        ['product', 'hero', 'heroTitle', 'SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS', null, null, null, null],
        ['product', 'toolbar', 'searchPlaceholder', 'Search Products...', null, null, null, null],
        ['product', 'toolbar', 'pagerLabel', 'Page', null, null, null, null],
        ['product', 'toolbar', 'pagerOfLabel', 'of', null, null, null, null],
        ['product', 'toolbar', 'sortFeaturedLabel', 'Sort By: Featured', null, null, null, null],
        ['product', 'toolbar', 'sortLowLabel', 'Price: Low to High', null, null, null, null],
        ['product', 'toolbar', 'sortHighLabel', 'Price: High to Low', null, null, null, null],
        ['product', 'states', 'loadingProductsLabel', 'Loading products...', null, null, null, null],
        ['product', 'states', 'noProductsLabel', 'No products found.', null, null, null, null],
        ['product', 'actions', 'addToCartLabel', 'ADD TO CART', null, null, null, null],
        ['product', 'actions', 'outOfStockLabel', 'OUT OF STOCK', null, null, null, null],
        ['product', 'modal', 'modalBreadcrumb', 'Collection / Studio Pieces', null, null, null, null],
        ['product', 'modal', 'modalOutOfStock', 'Out of Stock', null, null, null, null],
        ['product', 'modal', 'modalItemAdded', 'Item Added', null, null, null, null],
        ['product', 'modal', 'modalAddToCart', 'Add to Cart', null, null, null, null],
        ['product', 'modal', 'modalStock', 'Stock', null, null, null, null],
        ['product', 'modal', 'modalCategory', 'Category', null, null, null, null],
        ['product', 'modal', 'modalStatus', 'Status', null, null, null, null],
        ['product', 'modal', 'modalInStock', 'In Stock', null, null, null, null],
        ['product', 'modal', 'modalLocalProduct', 'Local Product', null, null, null, null],
        ['product', 'modal', 'modalActiveStatus', 'Active', null, null, null, null],
    ];

    $stmt = $conn->prepare("
        INSERT INTO website_content (page, section, content_key, title, subtitle, description, cta_label, cta_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE content_key = content_key
    ");
    foreach ($defaults as $row) {
        $stmt->execute($row);
    }
}

function ensureBlogsSeed(): void
{
    global $conn;
    $defaults = [
        ['blogs','hero','heroLine1','Discover the stories',null,null,null,null],
        ['blogs','hero','heroLine2','behind every brew.',null,null,null,null],
        ['blogs','intro','introTitle','Read coffee stories on our Blog',null,null,null,null],
        ['blogs','intro','introDesc',null,null,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',null,null],
        ['blogs','featured','featuredLabel','Featured Posts',null,null,null,null],
        ['blogs','featured','readFullStoryLabel','Read the Full Story',null,null,null,null],
        ['blogs','featured','featured1Image',null,null,null,null,null],
        ['blogs','featured','featured1Title','Will drinking coffee prolong your life?',null,null,null,null],
        ['blogs','featured','featured1Excerpt',null,null,'Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio illo dolor delectus et recusandae. Impedit aut cupiditate. Illum eveniet officiis ullam ipsam sed iste eius. Nam at quae ducimus dicta delectus',null,null],
        ['blogs','featured','featured1Date','October 9, 2018',null,null,null,null],
        ['blogs','featured','featured2Image',null,null,null,null,null],
        ['blogs','featured','featured2Title','Health Check: why do I get a headache when I haven\'t had my coffee?',null,null,null,null],
        ['blogs','featured','featured2Excerpt',null,null,'It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',null,null],
        ['blogs','featured','featured2Date','October 9, 2018',null,null,null,null],
        ['blogs','latest','latestHeading','Latest Posts',null,null,null,null],
        ['blogs','latest','latest1Image',null,null,null,null,null],
        ['blogs','latest','latest1Title','More coffee, lower death risk?',null,null,null,null],
        ['blogs','latest','latest1Excerpt',null,null,'Eveniet itaque aperiam qui officia in ducimus. Voluptas culpa ut eligendi in. Minima est dolores dolore aut et alias p',null,null],
        ['blogs','latest','latest1Date','October 9, 2018',null,null,null,null],
        ['blogs','latest','latest2Image',null,null,null,null,null],
        ['blogs','latest','latest2Title','Will drinking coffee prolong your life?',null,null,null,null],
        ['blogs','latest','latest2Excerpt',null,null,'Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio illo dolor delectus et recusandae.',null,null],
        ['blogs','latest','latest2Date','October 9, 2018',null,null,null,null],
        ['blogs','latest','latest3Image',null,null,null,null,null],
        ['blogs','latest','latest3Title','Health Check: why do I get a headache when I haven\'t had my coffee?',null,null,null,null],
        ['blogs','latest','latest3Excerpt',null,null,'It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',null,null],
        ['blogs','latest','latest3Date','October 9, 2018',null,null,null,null],
        ['blogs','latest','latest4Image',null,null,null,null,null],
        ['blogs','latest','latest4Title','How long does a cup of coffee keep you awake?',null,null,null,null],
        ['blogs','latest','latest4Excerpt',null,null,'It is a paradisematic country, in which roasted parts. Vel qui et ad voluptatem.',null,null],
        ['blogs','latest','latest4Date','October 9, 2018',null,null,null,null],
        ['blogs','latest','latest5Image',null,null,null,null,null],
        ['blogs','latest','latest5Title','Recent research suggests that heavy coffee drinkers may reap health benefits.',null,null,null,null],
        ['blogs','latest','latest5Excerpt',null,null,'It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',null,null],
        ['blogs','latest','latest5Date','October 9, 2018',null,null,null,null],
        ['blogs','sidebar','sidebarAboutHeading','About Us',null,null,null,null],
        ['blogs','sidebar','sidebarBrandName','Kape\'t Pamana',null,null,null,null],
        ['blogs','sidebar','sidebarAboutText',null,null,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',null,null],
        ['blogs','sidebar','sidebarAboutLinkLabel','Read the full Story',null,null,null,null],
        ['blogs','sidebar','sidebarCategoriesHeading','Categories',null,null,null,null],
        ['blogs','sidebar','category1','Barista',null,null,null,null],
        ['blogs','sidebar','category2','Coffee',null,null,null,null],
        ['blogs','sidebar','category3','Lifestyle',null,null,null,null],
        ['blogs','sidebar','category4','Mugs',null,null,null,null],
        ['blogs','sidebar','sidebarAuthorsHeading','Authors',null,null,null,null],
        ['blogs','sidebar','author1Name','Anthony',null,null,null,null],
        ['blogs','sidebar','author2Name','Elaiza',null,null,null,null],
        ['blogs','sidebar','author3Name','Reuel',null,null,null,null],
        ['blogs','sidebar','author4Name','Samuel',null,null,null,null],
        ['blogs','sidebar','author5Name','Uayan',null,null,null,null],
        ['blogs','sidebar','author6Name','Yu',null,null,null,null],
        ['blogs','quote','quoteText',null,null,'"I wake up some mornings and sit and have my coffee and look out at my beautiful garden, and I go, \'Remember how good this is. Because you can lose it.\'"',null,null],
        ['blogs','quote','quoteAuthor','Jason Johnson · Owner of CoffeeStyle',null,null,null,null],
    ];
    $stmt = $conn->prepare("INSERT INTO website_content (page, section, content_key, title, subtitle, description, cta_label, cta_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE content_key = content_key");
    foreach ($defaults as $row) $stmt->execute($row);
}

function ensureContactSeed(): void
{
    global $conn;
    $defaults = [
        ['contact','hero','heroLine1','Let\'s showcase Filipino Merchants',null,null,null,null],
        ['contact','hero','heroLine2','Together',null,null,null,null],
        ['contact','intro','connectTitle','Let\'s Connect',null,null,null,null],
        ['contact','intro','connectDesc',null,null,'We’d love to hear from you! Your thoughts, experiences, and feedback help us grow and continue delivering meaningful coffee and cultural products. Share your reviews, suggestions, and stories with us, and let us know how Kape’t Ani has become part of your daily rituals.',null,null],
        ['contact','office','officesLabel','OUR OFFICES',null,null,null,null],
        ['contact','office','office1Image',null,null,null,null,null],
        ['contact','office','office1Branch','Main Branch',null,null,null,null],
        ['contact','office','office1Address','Congressional Avenue, San Beda St., Quezon City',null,null,null,null],
        ['contact','office','openingTimesLabel','Opening Times',null,null,null,null],
        ['contact','office','office1HoursMonFri','Mon - Fri 08:00 to 22:00',null,null,null,null],
        ['contact','office','office1HoursSat','Sat - 09:00 to 20:00',null,null,null,null],
        ['contact','office','office1HoursSun','Sun - 12:00 to 18:00',null,null,null,null],
        ['contact','office','office2Image',null,null,null,null,null],
        ['contact','office','office2Branch','Main Branch',null,null,null,null],
        ['contact','office','office2Address','Congressional Avenue, San Beda St., Quezon City',null,null,null,null],
        ['contact','office','office2HoursMonFri','Mon - Fri 08:00 to 22:00',null,null,null,null],
        ['contact','office','office2HoursSat','Sat - 09:00 to 20:00',null,null,null,null],
        ['contact','office','office2HoursSun','Sun - 12:00 to 18:00',null,null,null,null],
        ['contact','form','contactFormLabel','CONTACT FORM',null,null,null,null],
        ['contact','form','contactFormDesc',null,null,'Drop us your message and I\'ll get back to you as soon as possible.',null,null],
        ['contact','form','formNameLabel','Name',null,null,null,null],
        ['contact','form','formNamePlaceholder','Your full name',null,null,null,null],
        ['contact','form','formEmailLabel','Email',null,null,null,null],
        ['contact','form','formEmailPlaceholder','your@email.com',null,null,null,null],
        ['contact','form','formMessageLabel','Message',null,null,null,null],
        ['contact','form','formMessagePlaceholder','Your Message',null,null,null,null],
        ['contact','form','formSendButton','Send Message',null,null,null,null],
        ['contact','details','contactAddressLabel','CONTACT FORM',null,null,null,null],
        ['contact','details','contactAddressText','Kape\'t Pamana, 11 Sumulong Highway, Brgy. Sta. Cruz',null,null,null,null],
        ['contact','details','callUsLabel','Call US',null,null,null,null],
        ['contact','details','callUsValue','+63 (917) 1234567',null,null,null,null],
        ['contact','details','emailUsLabel','Email Us',null,null,null,null],
        ['contact','details','emailUsValue','kapetpamana@gmail.com',null,null,null,null],
        ['contact','map','mapEmbedUrl','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7721.649797554171!2d121.16023039427121!3d14.609048625508008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b9003bb23f0f%3A0x3b8ac521ba0a2f61!2sStarbucks%2011%20Sumulong%20Highway%20Antipolo!5e0!3m2!1sen!2sph!4v1774162957750!5m2!1sen!2sph',null,null,null,null],
    ];
    $stmt = $conn->prepare("INSERT INTO website_content (page, section, content_key, title, subtitle, description, cta_label, cta_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE content_key = content_key");
    foreach ($defaults as $row) $stmt->execute($row);
}

function ensureAboutSeed(): void
{
    global $conn;
    $defaults = [
        ['about','hero','heroTitle','Behind the success of Kape\'t Ani',null,null,null,null],
        ['about','hero','heroSubtitle','Passion drives success behind scenes.',null,null,null,null],
        ['about','story','storyLabel','Our Story',null,null,null,null],
        ['about','story','storyText',null,null,'"Kape\'t Ani started as a small dream: to share the richness of Filipino coffee and culture while supporting local farmers and artisans."',null,null],
        ['about','heritage','heritageImage1',null,null,null,null,null],
        ['about','heritage','heritageTitle1','Curating heritage, craftsmanship, and culture beyond everyday living.',null,null,null,null],
        ['about','heritage','heritagePara1a',null,null,'Kape\'t Ani brings together the richness of Filipino tradition and the artistry of local craftsmanship to create experiences that go beyond the ordinary.',null,null],
        ['about','heritage','heritagePara1b',null,null,'Each carefully selected product reflects a deep respect for culture, quality, and community, transforming simple moments into meaningful rituals.',null,null],
        ['about','heritage','heritageTitle2','Where heritage, coffee, and craft meet refined living.',null,null,null,null],
        ['about','heritage','heritagePara2',null,null,'Each cup was a tribute to farmers who rose before dawn, and each handcrafted piece reflected traditions shaped by time and patience.',null,null],
        ['about','heritage','heritageImage2',null,null,null,null,null],
        ['about','team','teamLabel','— Meet the Team —',null,null,null,null],
        ['about','team','team1Name','Uayan',null,null,null,null],['about','team','team1Role','Technical Lad',null,null,null,null],
        ['about','team','team2Name','Reuel',null,null,null,null],['about','team','team2Role','Operations Manager',null,null,null,null],
        ['about','team','team3Name','Elaiza',null,null,null,null],['about','team','team3Role','Barista',null,null,null,null],
        ['about','team','team4Name','Anthony',null,null,null,null],['about','team','team4Role','CEO',null,null,null,null],
        ['about','team','team5Name','Samuel',null,null,null,null],['about','team','team5Role','Designer',null,null,null,null],
        ['about','team','team6Name','Yu',null,null,null,null],['about','team','team6Role','Marketing',null,null,null,null],
        ['about','timeline','timelineLabel','— History Timeline —',null,null,null,null],
        ['about','timeline','timeline4Date','OCTOBER 2018',null,null,null,null],['about','timeline','timeline4Title','One cup, one craft, one story.',null,null,null,null],['about','timeline','timeline4Desc',null,null,'From a small dream to a growing e-commerce platform, Kape’t Ani expanded its product lines and partnerships.',null,null],
        ['about','timeline','timeline3Date','AUGUST 2018',null,null,null,null],['about','timeline','timeline3Title','Building deeper connections',null,null,null,null],['about','timeline','timeline3Desc',null,null,'The team reached out to community-based coffee farmers and artisans, learning their stories and understanding the care behind every bean.',null,null],
        ['about','timeline','timeline2Date','JUNE 2018',null,null,null,null],['about','timeline','timeline2Title','Small steps',null,null,null,null],['about','timeline','timeline2Desc',null,null,'Kape’t Ani started as a small dream to share the richness of Filipino coffee and culture while supporting local farmers.',null,null],
        ['about','timeline','timeline1Date','NOVEMBER 2017',null,null,null,null],['about','timeline','timeline1Title','We\'ve started Kape\'t Ani.',null,null,null,null],
    ];
    $stmt = $conn->prepare("INSERT INTO website_content (page, section, content_key, title, subtitle, description, cta_label, cta_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE content_key = content_key");
    foreach ($defaults as $row) $stmt->execute($row);
}

function parseBody(): array
{
    if (isMultipart()) return $_POST;
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

function imageMode(): bool
{
    return isset($_GET['image_id']);
}

function outputImage(): void
{
    global $conn;
    $id = (int)($_GET['image_id'] ?? 0);
    if (!$id) {
        http_response_code(404);
        exit();
    }
    $stmt = $conn->prepare("SELECT image_type, image_blob FROM website_content WHERE id=? LIMIT 1");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || empty($row['image_blob']) || empty($row['image_type'])) {
        http_response_code(404);
        exit();
    }
    header("Content-Type: " . $row['image_type']);
    echo $row['image_blob'];
    exit();
}

function isMultipart(): bool
{
    if (!empty($_FILES)) return true;
    $ct = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    return str_contains($ct, 'multipart/form-data');
}

function extractImage(): ?array
{
    if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) return null;
    $file = $_FILES['image'];
    $maxBytes = 10 * 1024 * 1024;
    if ($file['size'] > $maxBytes) sendResponse(400, false, 'Image must be under 10 MB');

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowed)) sendResponse(400, false, 'Only JPG, PNG, GIF, and WEBP images are allowed');

    return [
        'blob' => file_get_contents($file['tmp_name']),
        'type' => $mime,
        'name' => basename($file['name']),
    ];
}

function listContent(): void
{
    global $conn;
    $pageFilter = trim($_GET['page'] ?? '');
    if ($pageFilter !== '') {
        $stmt = $conn->prepare("
            SELECT id, page, section, content_key, title, subtitle, description, cta_label, cta_link,
                   image_name, image_type, updated_at
            FROM website_content
            WHERE page = ?
            ORDER BY section ASC, id DESC
        ");
        $stmt->execute([$pageFilter]);
    } else {
        $stmt = $conn->query("
            SELECT id, page, section, content_key, title, subtitle, description, cta_label, cta_link,
                   image_name, image_type, updated_at
            FROM website_content
            ORDER BY page ASC, section ASC, id DESC
        ");
    }
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $formatted = array_map(function ($r) {
        $imageUrl = !empty($r['image_name'])
            ? LINK_PATH . "WebsiteContentController.php?image_id=" . $r['id'] . "&t=" . urlencode((string)$r['updated_at'])
            : null;
        return [
            'id' => (int)$r['id'],
            'page' => $r['page'],
            'section' => $r['section'],
            'content_key' => $r['content_key'],
            'title' => $r['title'] ?? '',
            'subtitle' => $r['subtitle'] ?? '',
            'description' => $r['description'] ?? '',
            'cta_label' => $r['cta_label'] ?? '',
            'cta_link' => $r['cta_link'] ?? '',
            'image_url' => $imageUrl,
            'image_name' => $r['image_name'] ?? null,
            'updated_at' => $r['updated_at'],
        ];
    }, $rows);

    sendResponse(200, true, 'Website content fetched', ['items' => $formatted]);
}

function addContent(array $data): void
{
    global $conn;
    $page = trim($data['page'] ?? '');
    $section = trim($data['section'] ?? '');
    $contentKey = trim($data['content_key'] ?? '');
    $title = trim($data['title'] ?? '');
    $subtitle = trim($data['subtitle'] ?? '');
    $description = trim($data['description'] ?? '');
    $ctaLabel = trim($data['cta_label'] ?? '');
    $ctaLink = trim($data['cta_link'] ?? '');

    if ($page === '' || $section === '' || $contentKey === '') {
        sendResponse(400, false, 'Page, section, and content key are required');
    }

    $image = extractImage();
    $stmt = $conn->prepare("
        INSERT INTO website_content
        (page, section, content_key, title, subtitle, description, cta_label, cta_link, image_name, image_type, image_blob)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bindValue(1, $page);
    $stmt->bindValue(2, $section);
    $stmt->bindValue(3, $contentKey);
    $stmt->bindValue(4, $title ?: null);
    $stmt->bindValue(5, $subtitle ?: null);
    $stmt->bindValue(6, $description ?: null);
    $stmt->bindValue(7, $ctaLabel ?: null);
    $stmt->bindValue(8, $ctaLink ?: null);
    $stmt->bindValue(9, $image ? $image['name'] : null);
    $stmt->bindValue(10, $image ? $image['type'] : null);
    $stmt->bindValue(11, $image ? $image['blob'] : null, PDO::PARAM_LOB);
    $stmt->execute();
    sendResponse(201, true, 'Content item added', ['id' => (int)$conn->lastInsertId()]);
}

function updateContent(array $data): void
{
    global $conn;
    $id = (int)($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'ID is required');

    $page = trim($data['page'] ?? '');
    $section = trim($data['section'] ?? '');
    $contentKey = trim($data['content_key'] ?? '');
    $title = trim($data['title'] ?? '');
    $subtitle = trim($data['subtitle'] ?? '');
    $description = trim($data['description'] ?? '');
    $ctaLabel = trim($data['cta_label'] ?? '');
    $ctaLink = trim($data['cta_link'] ?? '');
    $removeImg = ($data['remove_image'] ?? '') === '1';

    if ($page === '' || $section === '' || $contentKey === '') {
        sendResponse(400, false, 'Page, section, and content key are required');
    }

    $exists = $conn->prepare("SELECT id FROM website_content WHERE id=? LIMIT 1");
    $exists->execute([$id]);
    if (!$exists->fetch()) sendResponse(404, false, 'Content item not found');

    $image = extractImage();
    if ($image) {
        $stmt = $conn->prepare("
            UPDATE website_content
            SET page=?, section=?, content_key=?, title=?, subtitle=?, description=?, cta_label=?, cta_link=?,
                image_name=?, image_type=?, image_blob=?
            WHERE id=?
        ");
        $stmt->bindValue(1, $page);
        $stmt->bindValue(2, $section);
        $stmt->bindValue(3, $contentKey);
        $stmt->bindValue(4, $title ?: null);
        $stmt->bindValue(5, $subtitle ?: null);
        $stmt->bindValue(6, $description ?: null);
        $stmt->bindValue(7, $ctaLabel ?: null);
        $stmt->bindValue(8, $ctaLink ?: null);
        $stmt->bindValue(9, $image['name']);
        $stmt->bindValue(10, $image['type']);
        $stmt->bindValue(11, $image['blob'], PDO::PARAM_LOB);
        $stmt->bindValue(12, $id, PDO::PARAM_INT);
        $stmt->execute();
    } elseif ($removeImg) {
        $stmt = $conn->prepare("
            UPDATE website_content
            SET page=?, section=?, content_key=?, title=?, subtitle=?, description=?, cta_label=?, cta_link=?,
                image_name=NULL, image_type=NULL, image_blob=NULL
            WHERE id=?
        ");
        $stmt->execute([$page, $section, $contentKey, $title ?: null, $subtitle ?: null, $description ?: null, $ctaLabel ?: null, $ctaLink ?: null, $id]);
    } else {
        $stmt = $conn->prepare("
            UPDATE website_content
            SET page=?, section=?, content_key=?, title=?, subtitle=?, description=?, cta_label=?, cta_link=?
            WHERE id=?
        ");
        $stmt->execute([$page, $section, $contentKey, $title ?: null, $subtitle ?: null, $description ?: null, $ctaLabel ?: null, $ctaLink ?: null, $id]);
    }
    sendResponse(200, true, 'Content item updated');
}

function deleteContent(array $data): void
{
    global $conn;
    $id = (int)($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'ID is required');
    $stmt = $conn->prepare("DELETE FROM website_content WHERE id=?");
    $stmt->execute([$id]);
    sendResponse(200, true, 'Content item deleted');
}

try {
    ensureTable();
    ensureHomeSeed();
    ensureProductSeed();
    ensureBlogsSeed();
    ensureContactSeed();
    ensureAboutSeed();
    if (imageMode()) outputImage();

    $method = $_SERVER['REQUEST_METHOD'];
    $data = parseBody();
    $override = strtoupper($data['_method'] ?? '');
    if ($method === 'POST' && $override === 'PUT') {
        $method = 'PUT';
        unset($data['_method']);
    }

    if ($method === 'GET') listContent();
    if ($method === 'POST') addContent($data);
    if ($method === 'PUT') updateContent($data);
    if ($method === 'DELETE') deleteContent($data);

    sendResponse(405, false, 'Method not allowed');
} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}

