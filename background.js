console.log("background working");

// backend code will be here


var num_syllable = {"1M": 3, "1T": 2, "100": 2, "1-6, 8-10": 1, "0, 7": 2, "11, 17": 3, "12": 1, "13-19": 2, "11+, 10s": 2, "70": 3};
const abr = /\b[A-Z\.]{2,}\b.?/g;
const punc = /\.|\!|\?/g; 
const extra_punc = /\"|\.|\?|\!|\,/g;
const vce = /[aeiou][^aeiou][e]/g;


function word_count(text) {
    if (text === "") {
        return 0;
    }
    return text.split(' ').length;
}

function sentence_count(text) {
    text = text.replaceAll(abr, "");
    if (text.match(punc) != null) {
        return text.match(punc).length;
    }
    return 0;
}

function char_of_word(word) {
    return word.split('');
}

function filter(word) {
    let word_lower = word.toLowerCase();
    word_lower = word_lower.replace(extra_punc, "");
    if (word_lower.length >= 3) {
        let last_three = word_lower.substring(word_lower.length - 3);
        if (last_three.match(vce)) {
            return word_lower.substring(0, word_lower.length - 1);
        }
    }
    return word_lower;
}



function zero_filter(char_list) {
    let index = 0;
    let front = true;
    while(front) {
        if(char_list[index] === "0") {
            index = index + 1;
            // structure holding char_list uncertain (currently: Array)
            if(index == char_list.length) {
                return [];
            }
        }
        else{
            front = false;
        }
    }
    return char_list.slice(index);
}


function number_digit_count(first_three_digits) {
    let lst = [];
    first_three_digits.toString();
    for (let i = first_three_digits.length - 1; i >= 0; i--) {
        lst.push(first_three_digits[i]);
    }
    
    lst = zero_filter(lst);
    let place = lst.length;
    let count = 0;
    if (!place) {
        return 0;
    }
    if (place == 3) {
        let digit = parseInt(lst[0]);
        
        if (digit == 7) {
            count += num_syllable["0, 7"];
        }
        else if (0 <= digit <= 9) {
            
            count += num_syllable["1-6, 8-10"];
        }
        count += num_syllable["100"];
        place -= 1;
        lst = lst.slice(1);

    }
    if (place == 2) {
        let digit = parseInt(lst[0]);
        let ones = parseInt(lst[1]);
        if (digit == 1) {
            if (ones == 0) {
                return count + num_syllable['1-6, 8-10'];
            }
            else if (ones == 1 || ones == 7) {
                return count + num_syllable['11, 17'];
            }
            else if (ones == 2) {
                return count + num_syllable['12'];
            }
            else if (0 <= ones <= 9) {
                return count + num_syllable['13-19'];
            }
        }
        else if (digit == 7) {
            count += num_syllable['70'];
        }
        else if (digit != 0) {
            count += num_syllable['11+, 10s'];
        }
        place -= 1;
        lst = lst[1];

    }
    if (place == 1) {
        let digit = parseInt(lst[0]);
        if (digit == 0) {
            return count;
        }
        else if (digit == 7) {
            count += num_syllable['0, 7'];
        }
        else if (0 <= digit <= 9) {
            count += num_syllable['1-6, 8-10']
        }

    }
    return count;

}

function num_syllable_count(char_list) {
    let syllable_count = 0;
    
    let numbers = [];

    char_list.forEach(function (char){
        if("1234567890".includes(char)) {
            numbers = [char].concat(numbers);
        }
    })

    let thousands_place = [4, 5, 6];
    let millions_place = [7, 8, 9];
    let place = numbers.length;

    if(zero_filter(numbers) == 0) {
        return num_syllable["0, 7"];
    }
    let tempCount = 0;

    if(millions_place.includes(place)) {
        
        tempCount = number_digit_count(numbers.slice(6));
        if(tempCount) {
            syllable_count += tempCount + num_syllable["1M"];
        }
        numbers = numbers.slice(0, 6);
        place = numbers.length;
        
    }
    
    if(thousands_place.includes(place)) {
        tempCount = number_digit_count(numbers.slice(3));
        if(tempCount) {
            syllable_count += tempCount + num_syllable["1T"];
        }
        numbers = numbers.slice(0, 3);
        place = numbers.length;
    }

    if(place <= 3) {
        tempCount = number_digit_count(numbers);
        if(tempCount) {
            syllable_count += tempCount;
        }
    }

    return syllable_count;
}



function syllable_count(char_list) {
    let vowels = 'aeiouy';
    vowels = vowels.split('');
    let special = ['eo', 'ia', 'io', 'u'];
    let vc_list = [];
    for (let i = 0; i < char_list.length; i++) {
        let status = false;
        for (let j = 0; j < vowels.length; j++) {
            if (char_list[i] == vowels[j]) {
                vc_list.push(true);
                status = true
            }
        }
        if(!status) {
            vc_list.push(false);
        }
    }

    // 2vowel 2 syllable: eo, ia, io, uo
    
    if (vc_list.length >= 2) {
        for (let i = 0; i < vc_list.length - 1; i++) {
            if (vc_list[i] == vc_list[i + 1]) {
                if (!special.includes(char_list[i].concat(char_list[i+1]))) {
                    vc_list[i] = false;
                }
            }

        }
    }
    
    let reducer = (accumulator, currentValue) => accumulator + currentValue;
    return vc_list.reduce(reducer, 0);
    
}


function text_syllable_count(text) {
    let syllables = 0;
    let total_syllables = 0;
    let split_str = text.split(' ');
    let char_list;
    
    split_str.forEach( function(word) {
        char_list = word.split('');
        
        let i = 0;
        while(i < char_list.length) {
            if("1234567890".includes(char_list[i])) {
                syllables += num_syllable_count(char_list);
                break;
            }
            i += 1;
        }

        if(word.match(abr)) {
            console.log("Match passed")
            char_list.forEach(function (char) {
                if(char.toLowerCase() == "w") {
                    syllables += 3;
                }
                else if("abcdefghijklmnopqrstuvxyz".includes(char.toLowerCase())) {
                    syllables += 1;
                }
            })
            total_syllables += syllables;
        }
        else {
            word = filter(word);
            console.log(word)
            char_list = char_of_word(word)
            console.log(char_list)
            syllables += syllable_count(char_list)
            total_syllables += syllables;
        }
        syllables = 0;
    })
    
    return total_syllables;
}


function flesch_score(text) {
    if (sentence_count(text) == 0 || word_count(text) == 0) {
        if (word_count(text) == 0) {
            return "No words";
        }
        else {
            return "No sentences";
        }
    }
    return 206.835 - 1.015 * (word_count(text) / sentence_count(text)) - 84.6 * (text_syllable_count(text) / word_count(text));
}

function flesch_kincaid_grade(text) {
    if(!sentence_count(text)||!word_count(text)) {
        if (word_count(text) == 0) {
            return "No words";
        }
        else {
            return "No sentences";
        }
    }
    return 0.39 * (word_count(text) / sentence_count(text)) + 11.8 * (text_syllable_count(text) / word_count(text)) - 15.59;
}

function sentence_complexity(text) {
    return (word_count(text) / sentence_count(text)) > 25;
}

function word_complexity(text) {
    let words = text.split(' ');
    let total_words = word_count(text);
    let total_syllables = 0;
    for (i = 0; i < total_words; i ++) {
        total_syllables += text_syllable_count(words[i]);
    }
    return (total_syllables / total_words) > 2;
}

function human_grade(text) {
    let score = flesch_score(text);
    let grading;
    if(score >= 101) {
        return "Under 5th Grade";
    }
    else if(score >= 90 && score < 101) {
        return "5th Grade";
    }
    else if(score >= 80 && score < 90) {
        return "6th Grade";
    }
    else if(score >= 70 && score < 80) {
        return "7th Grade";
    }
    else if(score >= 60 && score < 70) {
        return "8th/9th Grade";
    }
    else if(score >= 50 && score < 60) {
        return "10th/11th/12 Grade";
    }
    else if(score >= 30 && score < 50) {
        return "College";
    }
    else if(score >= 10 && score < 30) {
        return "College Graduate";
    }
    else if(score >= 0 && score < 10) {
        return "Professional";
    }
    else {
        return "Grading Unavailable"
    }
}



function stats(text) {
    return [word_count(text), sentence_count(text), text_syllable_count(text), flesch_score(text), flesch_kincaid_grade(text)];
}

function rate(text) {
    return [human_grade(text)];
}


var portCS;
var msg;
var grade;

// when connected to content script use connection function
chrome.runtime.onConnect.addListener(connection);

function connection(port) {
    // received connection
    console.log('received connection')
    portCS = port;

    // when receiving message use lambda function
    portCS.onMessage.addListener(
        function(m) {
            msg = m;
            grade = rate(msg);
            console.log("got message:", msg);
        }
    );

    // once we have message from content, send message to popup
    // we only activate when receiving response from popup
    // popups will not receive anything until clicked
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message == "popup active") {
                console.log("heard back from popup");
                sendResponse({text: [msg, grade]})
            }
        }
    )
}

