Final-Project

Nama : Novan Tiano
Email: josenoutinho@gmail.com
Kelas : Nodejs Backend Dev With Adonis 
Batch : 1

Overview
Aplikasi Main Bareng untuk mempertemukan pemuda-pemuda yang ingin berolahraga tim (futsal/voli/basket/minisoccer/soccer) dan booking tempat bersama. 
Definisi: 
    a. User
    Atribut tabel users: id, name, password, email, role
    Data pengguna aplikasi. Terdapat 2 role: ‘user’, ‘owner’. 
    user : pengguna biasa yang dapat melakukan booking ke satu field. Dapat melakukan join/unjoin ke booking tertentu.
    owner: pemilik venue yang menyewakan lapangan (field) untuk dibooking.
    b. Venue
    Atribut tabel venues: id, name, address, phone
    Data tempat sarana olahraga. Dapat berupa kompleks olahraga yang memiliki lebih dari satu lapangan (field) dan jenis olahraga. 
    c. Field
    Atribut tabel fields: id, name, type
    Field adalah bagian dari Venue. Setiap field akan memiliki type yaitu jenis olahraga yang dimainkan di antaranya : soccer, minisoccer, futsal, basketball, volleyball 
    d. Booking
    Atribut tabel bookings: id, user_id, play_date_start, play_date_end, field_id
    Booking adalah jadwal penyewaan atau jadwal main user di field/venue tertentu.



