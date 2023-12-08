let taulu = [
    {fname: 'Reima', lname: 'Riihimäki' },
    {fname: 'John', lname: 'Doe' },
    {fname: 'Lisa', lname: 'Simpson' }
];


//const uusiTaulu = taulu.find( p => p.lname.includes('i') );


taulu.forEach( p => console.log(p.lname))