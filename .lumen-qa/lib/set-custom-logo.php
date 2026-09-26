<?php
/**
 * QA helper: set the Lumen custom logo theme mod to a given attachment ID.
 * Usage: php set-custom-logo.php <attachment_id>
 * Uses direct DB access (same DB as the QA test instance) so it runs
 * without loading WordPress.
 */
$pdo = new PDO('mysql:host=localhost;dbname=lumen_test;charset=utf8mb4', 'lumen', 'lumenpw');
$optionName = 'theme_mods_lumen';
$tid = isset($argv[1]) ? (int) $argv[1] : 0;
if ($tid === 0) {
    fwrite(STDERR, "Usage: php " . basename(__FILE__) . " <attachment_id>\n");
    exit(1);
}
$row = $pdo->query("SELECT option_value FROM wp_options WHERE option_name='$optionName'")->fetch(PDO::FETCH_ASSOC);
$tm = ($row && $row['option_value']) ? unserialize($row['option_value']) : [];
if (!is_array($tm)) $tm = [];
$tm['custom_logo'] = $tid;
$pdo->prepare('UPDATE wp_options SET option_value = ? WHERE option_name = ?')
    ->execute([serialize($tm), $optionName]);
echo "SET custom_logo = $tid\n";
