// script.js - Código completo e corrigido

document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const calculatorCards = document.querySelectorAll('.card');
  const currentYearEl = document.getElementById('current-year');
  
  // Estado do menu
  let isMenuOpen = false;
  
  // Inicialização
  init();
  
  function init() {
    // Configurar ano atual
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Configurar toggle do menu
    if (menuToggle && menu) {
      setupMenuToggle();
    }
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar cards das calculadoras
    setupCalculatorCards();
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Prevenir fechamento do menu ao clicar dentro
    preventMenuCloseOnInsideClick();
    
    // Melhorias para mobile
    improveMobileExperience();
    
    // Inicializar calculadoras
    initializeCalculators();
  }
  
  function setupMenuToggle() {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
      if (isMenuOpen && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }
  
  function openMenu() {
    menu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    isMenuOpen = true;
    
    // Foco no primeiro link do menu
    const firstLink = menu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  function closeMenu() {
    menu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    isMenuOpen = false;
    
    // Devolve foco para o toggle
    menuToggle.focus();
  }
  
  function setupNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Atualizar link ativo
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Fechar menu no mobile
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }
  
  function setupCalculatorCards() {
    calculatorCards.forEach(card => {
      card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('card-button')) return;
        
        e.preventDefault();
        const calculatorType = this.dataset.calculator;
        
        // Atualizar navegação
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.dataset.target === calculatorType) {
            link.classList.add('active');
          }
        });
        
        // Scroll para a seção de calculadoras
        const calculatorSection = document.getElementById('calculator-section');
        if (calculatorSection) {
          calculatorSection.scrollIntoView({ behavior: 'smooth' });
          
          // Aguardar o scroll completar antes de mudar a aba
          setTimeout(() => {
            // Ativar a aba correspondente
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${calculatorType}"]`);
            if (tabBtn) {
              tabBtn.click();
            }
          }, 300);
        }
      });
    });
  }
  
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignora links vazios
        if (href === '#' || href === '') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  function preventMenuCloseOnInsideClick() {
    if (menu) {
      menu.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }
  
  function improveMobileExperience() {
    // Detectar se é mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('📱 Modo mobile detectado');
      
      // Prevenir zoom em inputs (melhor UX)
      document.addEventListener('touchstart', function(event) {
        if (event.target.matches('input, select, textarea')) {
          event.target.style.fontSize = '16px';
        }
      }, { passive: true });
      
      // Melhorar scroll em formulários
      const inputs = document.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          // Scroll suave para o campo em foco
          setTimeout(() => {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        });
      });
      
      // Otimizar performance
      document.documentElement.style.setProperty('--transition-base', '200ms ease');
    }
  }
  
  function connectNavigationToCalculators() {
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const target = this.dataset.target;
        
        // Scroll para a seção de calculadoras
        const calculatorSection = document.getElementById('calculator-section');
        if (calculatorSection) {
          e.preventDefault();
          
          // Scroll suave para a seção
          calculatorSection.scrollIntoView({ behavior: 'smooth' });
          
          // Aguardar o scroll completar antes de mudar a aba
          setTimeout(() => {
            // Ativar a aba correspondente
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
            if (tabBtn) {
              tabBtn.click();
            }
          }, 300);
        }
      });
    });
    
    // Conectar botões dos cards com as calculadoras
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#calculator-section') {
          const card = this.closest('.card');
          const calculatorType = card.dataset.calculator;
          
          // Scroll para a seção
          const calculatorSection = document.getElementById('calculator-section');
          if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
            
            // Aguardar o scroll completar antes de mudar a aba
            setTimeout(() => {
              // Ativar a aba correspondente
              const tabBtn = document.querySelector(`.tab-btn[data-tab="${calculatorType}"]`);
              if (tabBtn) {
                tabBtn.click();
              }
            }, 300);
          }
        }
      });
    });
  }
  
  function initializeCalculators() {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(() => {
      try {
        // Verificar se a classe CalculatorService existe
        if (typeof CalculatorService !== 'undefined') {
          const calculator = new CalculatorService();
          console.log('✅ Calculadoras inicializadas com sucesso!');
          
          // Conectar navegação com as calculadoras
          connectNavigationToCalculators();
        } else {
          console.warn('⚠️ Classe CalculatorService não encontrada. Verifique se calculator.js foi carregado.');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar calculadoras:', error);
      }
    }, 500);
  }
  
  // Observador de resize para ajustes
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Se a tela ficou grande e o menu está aberto, fecha
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  });
  
  // Adicionar classe de loading para transições
  document.body.classList.add('loading');
  window.addEventListener('load', function() {
    document.body.classList.remove('loading');
  });
});