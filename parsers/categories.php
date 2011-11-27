<?php
$file = fopen('SimpleWiki-po_linkach-categories-simple-20100401', 'r');
while ($str = fgets($file)) {
    $sarray = explode("\t", $str);
    $id = array_shift($sarray);
    $id = trim($id);
    echo 'INSERT INTO article_category (id_article, id_category) VALUES ';
    $stmp = array();
    foreach ($sarray as $s) {
        $stmp[] = "('{$id}', '".trim($s)."')";
    }
    echo join(",", $stmp);
    echo ";\n";
}
fclose($file);
