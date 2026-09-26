<?php
/**
 * QA helper: clear the Lumen custom logo theme mod (reverts header to the
 * site title fallback).
 */
$pdo = new PDO('mysql:host=localhost;dbname=lumen_test;charset=utf8mb4', 'lumen', 'lumenpw');
$optionName = 'theme_mods_lumen';
$row = $pdo->query("SELECT option_value FROM wp_options WHERE option_name='$optionName'")->fetch(PDO::FETCH_ASSOC);
$tm = ($row && $row['option_value']) ? unserialize($row['option_value']) : [];
if (!is_array($tm)) $tm = [];
unset($tm['custom_logo']);
$pdo->prepare('UPDATE wp_options SET option_value = ? WHERE option_name = ?')
    ->execute([serialize($tm), $optionName]);
echo "CLEARED custom_logo\n";
