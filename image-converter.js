// Image Path Converter for BookHaven
// Run this in the browser console after downloading images locally

function convertImagePaths() {
    // Mapping of book IDs to local image filenames
    const imageMap = {
        1: 'images/gatsby.jpg',
        2: 'images/mockingbird.jpg',
        3: 'images/1984.jpg',
        4: 'images/pride.jpg',
        5: 'images/catcher.jpg',
        6: 'images/harry.jpg',
        7: 'images/lotr.jpg',
        8: 'images/dune.jpg',
        9: 'images/hobbit.jpg',
        10: 'images/neuromancer.jpg'
    };

    // Update the books array
    books.forEach(book => {
        if (imageMap[book.id]) {
            book.image = imageMap[book.id];
        }
    });

    // Save to localStorage (optional backup)
    localStorage.setItem('bookData', JSON.stringify(books));

    console.log('Image paths converted to local paths!');
    console.log('Updated books array:', books);

    // Show the updated code that can be copied to main.js
    console.log('\nCopy this updated books array to js/main.js:');
    console.log('const books = ' + JSON.stringify(books, null, 4) + ';');
}

function revertToUrls() {
    // Revert back to URLs if needed
    const urlMap = {
        1: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
        2: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
        3: 'https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg',
        4: 'https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg',
        5: 'https://upload.wikimedia.org/wikipedia/en/3/32/Rye_catcher.jpg',
        6: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
        7: 'https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif',
        8: 'https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg',
        9: 'https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg',
        10: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Neuromancer_%28Book%29.jpg'
    };

    books.forEach(book => {
        if (urlMap[book.id]) {
            book.image = urlMap[book.id];
        }
    });

    console.log('Reverted to URL paths!');
}

// Auto-run conversion if this script is loaded
if (typeof books !== 'undefined') {
    console.log('BookHaven Image Path Converter loaded!');
    console.log('Run convertImagePaths() to convert to local paths');
    console.log('Run revertToUrls() to revert to URLs');
}