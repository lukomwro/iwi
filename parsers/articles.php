<?php
$file = fopen('SimpleWiki-po_linkach-lista-simple-20100401', 'r');
echo "SET foreign_key_checks = 0;\n";
while ($str = fgets($file)) {
    $sarray = explode('#', $str);
    $id = array_shift($sarray);
    $sarray = explode(' ', $sarray[0]);
    $id = trim($id);
    echo 'INSERT INTO article_article (id_article_from, id_article_to) VALUES ';
    $stmp = array();
    foreach ($sarray as $s) {
        $id_a2 = substr(trim($s), 0, -2);
        $stmp[] = "('{$id}', '{$id_a2}')";
    }
    echo join(",", $stmp);
    echo ";\n";
}
echo "SET foreign_key_checks = 1;\n";
fclose($file);
