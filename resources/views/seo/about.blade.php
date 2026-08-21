<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>About Us — UKM Music & Dance Arts Lises Asmarandana UMMI</h1>
        <p>UKM Lises Asmarandana is a student activity unit at Universitas Muhammadiyah Sukabumi (UMMI) focused on the preservation, development, and appreciation of traditional Sundanese arts, particularly traditional music and creative dance.</p>

        <section>
            <h2>The Philosophy of Asmarandana</h2>
            <p>The name <em>Asmarandana</em> is inspired by classic Sundanese poetry (pupuh), symbolizing passion, beauty, harmony, and sincerity in cultural artistic expression.</p>
        </section>

        <section>
            <h2>Vision & Mission</h2>
            <div>
                <h3>Vision</h3>
                <p>To be a premier center for character building, talent nurturing, and cultural expression in music and dance, achieving recognition at both regional and national levels.</p>
            </div>
            <div>
                <h3>Mission</h3>
                <ul>
                    <li>Preserve and cultivate traditional Indonesian art treasures, especially Sundanese heritage.</li>
                    <li>Create innovative, high-quality music and dance artistic works.</li>
                    <li>Elevate the name of Universitas Muhammadiyah Sukabumi through stellar artistic performances and cultural competitions.</li>
                </ul>
            </div>
        </section>

        <section>
            <h2>Organizational Structure & Membership</h2>
            <p>Lises Asmarandana is mentored by academic advisors from Universitas Muhammadiyah Sukabumi with an active and dedicated student executive board.</p>
        </section>

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/member') }}">Members & Board</a> | 
            <a href="{{ url('/gallery') }}">Art Gallery</a> | 
            <a href="{{ url('/contact') }}">Contact Us</a>
        </nav>
    @else
        <h1>Tentang Kami — UKM Seni Musik & Tari Lises Asmarandana UMMI</h1>
        <p>UKM Lises Asmarandana adalah unit kegiatan mahasiswa di Universitas Muhammadiyah Sukabumi (UMMI) yang berfokus pada pelestarian, pengembangan, dan apresiasi seni tradisional Sunda, khususnya seni musik dan seni tari kreasi.</p>

        <section>
            <h2>Filosofi Asmarandana</h2>
            <p>Nama <em>Asmarandana</em> diambil dari salah satu pupuh Sunda yang melambangkan rasa cinta, keindahan, dan ketulusan dalam berkarya seni budaya.</p>
        </section>

        <section>
            <h2>Visi & Misi</h2>
            <div>
                <h3>Visi</h3>
                <p>Menjadi wadah pembinaan dan pengembangan minat bakat mahasiswa di bidang seni tari dan musik yang berkarakter, berbudaya, serta berprestasi di tingkat regional maupun nasional.</p>
            </div>
            <div>
                <h3>Misi</h3>
                <ul>
                    <li>Menggali dan melestarikan khazanah kebudayaan dan kesenian tradisional Indonesia khususnya kesenian Sunda.</li>
                    <li>Menciptakan karya seni musik dan tari yang inovatif dan berkualitas.</li>
                    <li>Mengharumkan nama Universitas Muhammadiyah Sukabumi melalui berbagai pementasan dan kompetisi seni.</li>
                </ul>
            </div>
        </section>

        <section>
            <h2>Struktur Kepengurusan & Keanggotaan</h2>
            <p>Lises Asmarandana dibimbing oleh pembina dari sivitas akademika Universitas Muhammadiyah Sukabumi dengan kepengurusan aktif mahasiswa yang berdedikasi.</p>
        </section>

        <nav aria-label="Navigasi Terkait">
            <a href="{{ url('/') }}">Beranda</a> | 
            <a href="{{ url('/member') }}">Anggota & Pengurus</a> | 
            <a href="{{ url('/gallery') }}">Galeri Karya</a> | 
            <a href="{{ url('/contact') }}">Kontak Kami</a>
        </nav>
    @endif
</div>
