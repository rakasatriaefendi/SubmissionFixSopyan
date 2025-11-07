export default class AboutPage {
  async render() {
    return `
      <section class="page-content container" tabindex="-1">
        <h1>Tentang StoryMap</h1>
        <div class="card">
          <p>
            Kali ini saya, <strong>Sopyan Dermawan</strong>, membuat aplikasi <em>StoryMap</em> 
            sebagai contoh submission untuk modul <strong>Belajar PWI</strong>, 
            yang mencakup penerapan Peta, Media, Aksesibilitas, dan Transisi Halaman.
          </p>
        </div>
      </section>
    `;
  }
}
