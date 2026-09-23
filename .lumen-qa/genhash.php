<?php
function wp_hash($p) {
    $pwd = trim($p);
    $password_to_hash = base64_encode(hash_hmac('sha384', $pwd, 'wp-sha384', true));
    return '$wp' . password_hash($password_to_hash, PASSWORD_BCRYPT, []);
}
function wp_check($p, $h) {
    $pwd = trim($p);
    $password_to_verify = base64_encode(hash_hmac('sha384', $pwd, 'wp-sha384', true));
    return password_verify($password_to_verify, substr($h, 3));
}
$h = wp_hash('admin');
echo "hash: $h" . "\n";
echo "verify admin: " . (wp_check('admin', $h) ? 'PASS' : 'FAIL') . "\n";
echo "verify wrong: " . (wp_check('wrong', $h) ? 'PASS' : 'FAIL') . "\n";
file_put_contents('/tmp/adminhash.txt', $h);
