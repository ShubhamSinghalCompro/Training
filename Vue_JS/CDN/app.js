const app = Vue.createApp({
    //root component in view
    // data, functions, component template
    // template: `<h2>Template</h2>`,
    data () {
        return {
            title: 'New Book',
            author: 'New Author',
            age: 0,
            showAge: true,
            x:0,
            y:0,
            books: [{
                title: 'book1',
                author: 'author1',
                img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                isFav: true
            },
            {
                title: 'book2',
                author: 'author2',
                img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                isFav: false
            },
            {
                title: 'book3',
                author: 'author3',
                img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                isFav: false
            }],
            url: 'https:www.google.com',
        }
    },
    methods: {
        changeTitle(title) {
            this.title = title; // this is the vue instance
        },
        handleMouseOver(e, num) {
            console.log(e);
            console.log('mouseover');
            console.log(num);
        },
        handleMouseLeave(e) {
            console.log(e);
            console.log('mouseleave');
        },
        handleMouseDblClick(e) {
            console.log(e);
            console.log('double click');
        },
        handleMouseMove(e) {
            console.log(e);
            console.log('mousemove');
            this.x = e.offsetX;
            this.y = e.offsetY;
        },
        toggleFav(book) {
            book.isFav = !book.isFav;    
        }    
    },

    computed: {
        filteredBooks(){
             return this.books.filter((book) => book.isFav);
        }
    }
});

app.mount('#app')