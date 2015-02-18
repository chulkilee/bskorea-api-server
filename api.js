/*eslint-env node*/
'use strict';

var cheerio = require('cheerio');
var request = require('request');

var baseURL = 'http://www.bskorea.or.kr/infobank/korSearch/korbibReadpage.aspx';

var versions = [
    ['GAE', '개역개정'],
    ['HAN', '개역한글'],
    ['SAE', '표준새번역'],
    ['SAENEW', '새번역'],
    ['COG', '공동번역'],
    ['COGNEW', '공동번역']
];

var books = [
    ['gen', '창세기'],
    ['exo', '출애굽기'],
    ['lev', '레위기'],
    ['num', '민수기'],
    ['deu', '신명기'],
    ['jos', '여호수아'],
    ['jdg', '사사기'],
    ['rut', '룻기'],
    ['1sa', '사무엘상'],
    ['2sa', '사무엘하'],
    ['1ki', '열왕기상'],
    ['2ki', '열왕기하'],
    ['1ch', '역대상'],
    ['2ch', '역대하'],
    ['ezr', '에스라'],
    ['neh', '느헤미야'],
    ['est', '에스더'],
    ['job', '욥기'],
    ['psa', '시편'],
    ['pro', '잠언'],
    ['ecc', '전도서'],
    ['sng', '아가'],
    ['isa', '이사야'],
    ['jer', '예레미야'],
    ['lam', '예레미야애가'],
    ['ezk', '에스겔'],
    ['dan', '다니엘'],
    ['hos', '호세아'],
    ['jol', '요엘'],
    ['amo', '아모스'],
    ['oba', '오바댜'],
    ['jnh', '요나'],
    ['mic', '미가'],
    ['nam', '나훔'],
    ['hab', '하박국'],
    ['zep', '스바냐'],
    ['hag', '학개'],
    ['zec', '스가랴'],
    ['mal', '말라기'],
    ['mat', '마태복음'],
    ['mrk', '마가복음'],
    ['luk', '누가복음'],
    ['jhn', '요한복음'],
    ['act', '사도행전'],
    ['rom', '로마서'],
    ['1co', '고린도전서'],
    ['2co', '고린도후서'],
    ['gal', '갈라디아서'],
    ['eph', '에베소서'],
    ['php', '빌립보서'],
    ['col', '골로새서'],
    ['1th', '데살로니가전서'],
    ['2th', '데살로니가후서'],
    ['1ti', '디모데전서'],
    ['2ti', '디모데후서'],
    ['tit', '디도서'],
    ['phm', '빌레몬서'],
    ['heb', '히브리서'],
    ['jas', '야고보서'],
    ['1pe', '베드로전서'],
    ['2pe', '베드로후서'],
    ['1jn', '요한1서'],
    ['2jn', '요한2서'],
    ['3jn', '요한3서'],
    ['jud', '유다서'],
    ['rev', '요한계시록']
];

var isValidKey = function (array, key) {
    for (var i = 0; i < array.length ; i++) {
        if (array[i][0] === key) {
            return true;
        }
    }
    return false;
};

var get = function (version, book, chap, cb) {
    request.get({
        url: baseURL,
        qs: { version: version, book: book, chap: chap }
    }, function (error, httpResponse, body) {
        var doc = cheerio.load(body);
        var result = [];

        doc('#tdBible1 span').each(function () {
            var elm = cheerio(this);
            var text = elm.contents().filter(function() {
                return this.nodeType === 3; // TEXT_NODE
            }).text().replace(/^\s+|\s+$/, '');
            var verse = elm.find('.number').first().text().replace(/^\s+|\s+$/, '');
            result.push([verse, text]);
        });

        cb(result);
    });
};

module.exports = {
    get: get,
    isValidBook: function (book) {
        return isValidKey(books, book);
    },
    isValidVersion: function (version) {
        return isValidKey(versions, version);
    }
};
