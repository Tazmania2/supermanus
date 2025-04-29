document.addEventListener('DOMContentLoaded', () => {
    // Implementação do cabeçalho
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = `
            <div class="logo">
                <img src="img/superloot-logo.png" alt="Superloot Logo" onerror="this.src='img/placeholder-logo.png'">
                <span>superloot</span>
            </div>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="poe2.html">Path of Exile 2</a></li>
                    <li><a href="ragnarok.html">Ragnarok</a></li>
                    <li><a href="dofus.html">Dofus</a></li>
                </ul>
            </nav>
            <div class="user-section">
                <div class="avatar">C</div>
                <div class="balance">0,00</div>
            </div>
        `;
    }

    // Implementação do rodapé
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-info">
                    <div class="footer-logo">
                        <img src="img/superloot-logo.png" alt="Superloot Logo" onerror="this.src='img/placeholder-logo.png'">
                    </div>
                    <p>Superloot.gg - Sua loja de itens para jogos online.</p>
                </div>
                <div class="footer-links">
                    <h3>Links Rápidos</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="poe2.html">Path of Exile 2</a></li>
                        <li><a href="ragnarok.html">Ragnarok</a></li>
                        <li><a href="dofus.html">Dofus</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h3>Comunidade</h3>
                    <ul>
                        <li><a href="https://discord.gg/fnNEM6tR" target="_blank">Discord</a></li>
                        <li><a href="https://wa.me/5511997387181" target="_blank">WhatsApp</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Superloot.gg - Todos os direitos reservados.</p>
            </div>
        `;
    }

    // Implementação da seção de comunidade na página inicial
    const communitySection = document.getElementById('community');
    if (communitySection) {
        communitySection.innerHTML = `
            <h2>Junte-se à nossa comunidade!</h2>
            <p>Participe do nosso Discord para ficar por dentro das novidades, promoções e conversar com outros jogadores.</p>
            <a href="https://discord.gg/fnNEM6tR" target="_blank">Entrar no Discord</a>
        `;
    }

    // Implementação da seção de carteira na página inicial
    const main = document.querySelector('main');
    if (main && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const walletSection = document.createElement('section');
        walletSection.className = 'wallet-section';
        walletSection.innerHTML = `
            <div class="wallet-info">
                <h2>Carregue seus loots</h2>
                <p>Para comprar itens na nossa loja, você precisa carregar sua carteira primeiro. É super simples!</p>
            </div>
            <div class="wallet-balance">
                <div class="coin">C</div>
                <div class="amount">0,00</div>
                <div class="currency">R$</div>
            </div>
            <button class="add-funds-btn">ADICIONAR FUNDOS</button>
        `;
        
        // Inserir após o primeiro elemento h1 ou no início se não houver h1
        const h1 = main.querySelector('h1');
        if (h1) {
            h1.after(walletSection);
        } else {
            main.prepend(walletSection);
        }
    }

    // Adicionar classe ativa ao link da página atual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
