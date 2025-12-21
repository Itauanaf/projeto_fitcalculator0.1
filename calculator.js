// calculator.js - VERSÃO PARA PÁGINAS SEPARADAS

class CalculatorService {
  constructor() {
    console.log('🚀 Inicializando CalculatorService...');
    
    // Detecta em qual página estamos
    this.currentPage = this.detectCurrentPage();
    console.log(`📄 Página detectada: ${this.currentPage}`);
    
    // Inicializa apenas a calculadora da página atual
    this.initialize();
  }
  
  // Método NOVO: Detecta qual página está carregando
  detectCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('imc.html') || path.includes('imc')) {
      return 'imc';
    }
    
    if (path.includes('macros.html') || path.includes('macros')) {
      return 'macros';
    }
    
    if (path.includes('tdee.html') || path.includes('tdee')) {
      return 'tdee';
    }
    
    return 'index'; // Página inicial ou outra
  }
  
  initialize() {
    // Configura APENAS a calculadora da página atual
    switch(this.currentPage) {
      case 'imc':
        this.setupIMCCalculator();
        break;
        
      case 'macros':
        this.setupMacrosCalculator();
        break;
        
      case 'tdee':
        this.setupTDEECalculator();
        break;
        
      default:
        console.log('🏠 Página inicial ou não identificada - sem calculadoras');
    }
    
    // Configura botões que existem em todas as páginas
    this.setupSaveButtons();
    this.setupActionButtons();
  }
  
  // ========== CONFIGURAÇÃO IMC ==========
  setupIMCCalculator() {
    console.log('✅ Configurando calculadora IMC...');
    
    const imcForm = document.getElementById('imc-form');
    if (!imcForm) {
      console.error('❌ Formulário IMC não encontrado!');
      return;
    }
    
    // Evento de submit
    imcForm.addEventListener('submit', (e) => this.handleIMCSubmit(e));
    
    // Botão limpar
    const clearBtn = imcForm.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearIMCForm());
    }
    
    console.log('✅ Calculadora IMC configurada com sucesso!');
  }
  
  handleIMCSubmit(e) {
    e.preventDefault();
    console.log('📊 Calculando IMC...');
    
    const formData = new FormData(e.target);
    const data = {
      weight: parseFloat(formData.get('weight')),
      height: parseFloat(formData.get('height'))
    };
    
    // Validação
    if (!this.validateIMCData(data)) {
      this.showError('Por favor, insira valores válidos para peso e altura');
      return;
    }
    
    // Cálculo
    const result = this.calculateIMC(data);
    
    // Exibir resultado
    this.displayIMCResult(result);
    
    // Salvar no histórico
    this.saveToLocalStorage('imc', data, result);
  }
  
  validateIMCData(data) {
    if (isNaN(data.weight) || isNaN(data.height)) {
      return false;
    }
    if (data.weight < 20 || data.weight > 300) {
      this.showError('Peso deve estar entre 20kg e 300kg');
      return false;
    }
    if (data.height < 100 || data.height > 250) {
      this.showError('Altura deve estar entre 100cm e 250cm');
      return false;
    }
    return true;
  }
  
  calculateIMC(data) {
    // Fórmula: peso (kg) / altura² (m)
    const heightInMeters = data.height / 100;
    const imc = data.weight / (heightInMeters * heightInMeters);
    
    // Classificação
    const classification = this.classifyIMC(imc);
    
    // Faixa ideal (IMC entre 18.5 e 24.9)
    const idealMinWeight = 18.5 * (heightInMeters * heightInMeters);
    const idealMaxWeight = 24.9 * (heightInMeters * heightInMeters);
    
    // Progresso para barra
    const imcNum = parseFloat(imc);
    let progressPercentage;
    if (imcNum < 16) progressPercentage = 0;
    else if (imcNum > 40) progressPercentage = 100;
    else progressPercentage = ((imcNum - 16) / (40 - 16)) * 100;
    
    return {
      imc: imc.toFixed(2),
      classification,
      idealWeight: {
        min: idealMinWeight.toFixed(1),
        max: idealMaxWeight.toFixed(1)
      },
      progress: progressPercentage,
      originalData: data,
      timestamp: new Date().toISOString()
    };
  }
  
  classifyIMC(imc) {
    if (imc < 18.5) return {
      level: 'underweight',
      label: 'Abaixo do peso',
      color: '#60a5fa',
      risk: 'Baixo peso pode indicar desnutrição'
    };
    if (imc < 25) return {
      level: 'normal',
      label: 'Peso normal',
      color: '#34d399',
      risk: 'Peso saudável'
    };
    if (imc < 30) return {
      level: 'overweight',
      label: 'Sobrepeso',
      color: '#fbbf24',
      risk: 'Aumento do risco de doenças'
    };
    if (imc < 35) return {
      level: 'obesity1',
      label: 'Obesidade Grau I',
      color: '#f87171',
      risk: 'Risco moderado de doenças'
    };
    if (imc < 40) return {
      level: 'obesity2',
      label: 'Obesidade Grau II',
      color: '#dc2626',
      risk: 'Risco alto de doenças'
    };
    return {
      level: 'obesity3',
      label: 'Obesidade Grau III',
      color: '#7f1d1d',
      risk: 'Risco muito alto de doenças'
    };
  }
  
  displayIMCResult(result) {
    const resultContainer = document.getElementById('imc-result');
    const imcValue = document.getElementById('imc-value');
    const imcClassification = document.getElementById('imc-classification');
    const imcRange = document.getElementById('imc-range');
    const imcProgress = document.getElementById('imc-progress');
    
    if (!resultContainer || !imcValue) {
      console.error('❌ Elementos do resultado IMC não encontrados');
      return;
    }
    
    // Mostrar container
    resultContainer.classList.remove('hidden');
    
    // Atualizar valores
    imcValue.textContent = result.imc;
    imcClassification.textContent = `Classificação: ${result.classification.label}`;
    imcClassification.style.color = result.classification.color;
    imcRange.textContent = `Peso ideal: ${result.idealWeight.min}kg - ${result.idealWeight.max}kg`;
    
    // Atualizar progress bar
    if (imcProgress) {
      imcProgress.style.width = `${result.progress}%`;
      imcProgress.style.backgroundColor = result.classification.color;
    }
    
    // Scroll para o resultado
    setTimeout(() => {
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    console.log('✅ IMC calculado:', result);
  }
  
  clearIMCForm() {
    const form = document.getElementById('imc-form');
    const result = document.getElementById('imc-result');
    
    if (form) form.reset();
    if (result) result.classList.add('hidden');
    
    this.showSuccess('Formulário limpo!');
  }
  
  // ========== CONFIGURAÇÃO MACROS ==========
  setupMacrosCalculator() {
    console.log('✅ Configurando calculadora de Macros...');
    
    const macrosForm = document.getElementById('macros-form');
    if (!macrosForm) {
      console.error('❌ Formulário Macros não encontrado!');
      return;
    }
    
    macrosForm.addEventListener('submit', (e) => this.handleMacrosSubmit(e));
    
    const clearBtn = macrosForm.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearMacrosForm());
    }
    
    console.log('✅ Calculadora Macros configurada com sucesso!');
  }
  
  handleMacrosSubmit(e) {
    e.preventDefault();
    console.log('🥩 Calculando Macronutrientes...');
    
    const formData = new FormData(e.target);
    const data = {
      weight: parseFloat(formData.get('weight')),
      activityLevel: formData.get('activityLevel'),
      goal: formData.get('goal'),
      dietType: formData.get('dietType') || 'balanced'
    };
    
    // Validação
    if (!this.validateMacrosData(data)) {
      this.showError('Por favor, preencha todos os campos corretamente');
      return;
    }
    
    // Cálculo
    const result = this.calculateMacros(data);
    
    // Exibir resultado
    this.displayMacrosResult(result);
    
    // Salvar no histórico
    this.saveToLocalStorage('macros', data, result);
  }
  
  validateMacrosData(data) {
    if (isNaN(data.weight) || data.weight < 30 || data.weight > 300) {
      this.showError('Peso deve estar entre 30kg e 300kg');
      return false;
    }
    if (!data.activityLevel || !data.goal) {
      this.showError('Selecione o nível de atividade e objetivo');
      return false;
    }
    return true;
  }
  
  calculateMacros(data) {
    // Cálculo simplificado (você pode melhorar depois)
    const tdee = this.estimateTDEE({
      weight: data.weight,
      activityLevel: data.activityLevel
    });
    
    let targetCalories;
    switch(data.goal) {
      case 'loss': targetCalories = tdee * 0.8; break;
      case 'gain': targetCalories = tdee * 1.2; break;
      default: targetCalories = tdee;
    }
    
    // Distribuição baseada no tipo de dieta
    let proteinPerKg, carbPercentage, fatPercentage;
    
    switch(data.dietType) {
      case 'low-carb':
        proteinPerKg = 2.2; carbPercentage = 0.25; fatPercentage = 0.40;
        break;
      case 'high-protein':
        proteinPerKg = 2.5; carbPercentage = 0.40; fatPercentage = 0.25;
        break;
      case 'keto':
        proteinPerKg = 1.8; carbPercentage = 0.05; fatPercentage = 0.70;
        break;
      default: // balanced
        proteinPerKg = 1.8; carbPercentage = 0.50; fatPercentage = 0.30;
    }
    
    const proteinGrams = Math.round(data.weight * proteinPerKg);
    const proteinCalories = proteinGrams * 4;
    
    const remainingCalories = targetCalories - proteinCalories;
    const carbCalories = Math.round(remainingCalories * carbPercentage);
    const fatCalories = Math.round(remainingCalories * fatPercentage);
    
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);
    
    const totalCalories = proteinCalories + carbCalories + fatCalories;
    
    return {
      calories: Math.round(totalCalories),
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: Math.round((proteinCalories / totalCalories) * 100)
      },
      carbs: {
        grams: carbGrams,
        calories: carbCalories,
        percentage: Math.round((carbCalories / totalCalories) * 100)
      },
      fats: {
        grams: fatGrams,
        calories: fatCalories,
        percentage: Math.round((fatCalories / totalCalories) * 100)
      },
      originalData: data,
      timestamp: new Date().toISOString()
    };
  }
  
  estimateTDEE(data) {
    const bmr = 10 * data.weight + 6.25 * 170 - 5 * 30 + 5;
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    };
    
    return bmr * (activityMultipliers[data.activityLevel] || 1.2);
  }
  
  displayMacrosResult(result) {
    const resultContainer = document.getElementById('macros-result');
    const totalCalories = document.getElementById('total-calories');
    const proteinGrams = document.getElementById('protein-grams');
    const proteinPercentage = document.getElementById('protein-percentage');
    const carbsGrams = document.getElementById('carbs-grams');
    const carbsPercentage = document.getElementById('carbs-percentage');
    const fatsGrams = document.getElementById('fats-grams');
    const fatsPercentage = document.getElementById('fats-percentage');
    
    if (!resultContainer) {
      console.error('❌ Container de resultados Macros não encontrado');
      return;
    }
    
    // Mostrar container
    resultContainer.classList.remove('hidden');
    
    // Atualizar valores
    if (totalCalories) totalCalories.textContent = result.calories;
    if (proteinGrams) proteinGrams.textContent = result.protein.grams;
    if (proteinPercentage) proteinPercentage.textContent = `${result.protein.percentage}%`;
    if (carbsGrams) carbsGrams.textContent = result.carbs.grams;
    if (carbsPercentage) carbsPercentage.textContent = `${result.carbs.percentage}%`;
    if (fatsGrams) fatsGrams.textContent = result.fats.grams;
    if (fatsPercentage) fatsPercentage.textContent = `${result.fats.percentage}%`;
    
    // Scroll para o resultado
    setTimeout(() => {
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    console.log('✅ Macros calculados:', result);
  }
  
  clearMacrosForm() {
    const form = document.getElementById('macros-form');
    const result = document.getElementById('macros-result');
    
    if (form) form.reset();
    if (result) result.classList.add('hidden');
    
    this.showSuccess('Formulário limpo!');
  }
  
  // ========== CONFIGURAÇÃO TDEE ==========
  setupTDEECalculator() {
    console.log('✅ Configurando calculadora TDEE...');
    
    const tdeeForm = document.getElementById('tdee-form');
    if (!tdeeForm) {
      console.error('❌ Formulário TDEE não encontrado!');
      return;
    }
    
    tdeeForm.addEventListener('submit', (e) => this.handleTDEESubmit(e));
    
    const clearBtn = tdeeForm.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearTdeeForm());
    }
    
    console.log('✅ Calculadora TDEE configurada com sucesso!');
  }
  
  handleTDEESubmit(e) {
    e.preventDefault();
    console.log('🔥 Calculando TDEE...');
    
    const formData = new FormData(e.target);
    const data = {
      age: parseInt(formData.get('age')),
      gender: formData.get('gender'),
      weight: parseFloat(formData.get('weight')),
      height: parseFloat(formData.get('height')),
      activityLevel: formData.get('activityLevel')
    };
    
    if (!this.validateTDEEData(data)) {
      this.showError('Por favor, preencha todos os campos corretamente');
      return;
    }
    
    const result = this.calculateTDEE(data);
    this.displayTDEEResult(result);
    this.saveToLocalStorage('tdee', data, result);
  }
  
  validateTDEEData(data) {
    if (isNaN(data.age) || data.age < 15 || data.age > 100) {
      this.showError('Idade deve estar entre 15 e 100 anos');
      return false;
    }
    if (!data.gender) {
      this.showError('Selecione o gênero');
      return false;
    }
    if (isNaN(data.weight) || data.weight < 30 || data.weight > 300) {
      this.showError('Peso deve estar entre 30kg e 300kg');
      return false;
    }
    if (isNaN(data.height) || data.height < 100 || data.height > 250) {
      this.showError('Altura deve estar entre 100cm e 250cm');
      return false;
    }
    if (!data.activityLevel) {
      this.showError('Selecione o nível de atividade');
      return false;
    }
    return true;
  }
  
  calculateTDEE(data) {
    // Fórmula Harris-Benedict
    let bmr;
    
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      bmr = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    };
    
    const tdee = bmr * (activityMultipliers[data.activityLevel] || 1.2);
    
    // Calcular metas calóricas
    const lossCalories = Math.round(tdee * 0.8);
    const maintainCalories = Math.round(tdee);
    const gainCalories = Math.round(tdee * 1.2);
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      lossCalories,
      maintainCalories,
      gainCalories,
      activityLevel: data.activityLevel,
      originalData: data,
      timestamp: new Date().toISOString()
    };
  }
  
  displayTDEEResult(result) {
    const resultContainer = document.getElementById('tdee-result');
    const bmrValue = document.getElementById('bmr-value');
    const tdeeValue = document.getElementById('tdee-value');
    const lossCalories = document.getElementById('loss-calories');
    const maintainCalories = document.getElementById('maintain-calories');
    const gainCalories = document.getElementById('gain-calories');
    
    if (!resultContainer) {
      console.error('❌ Container de resultados TDEE não encontrado');
      return;
    }
    
    // Mostrar container
    resultContainer.classList.remove('hidden');
    
    // Atualizar valores
    if (bmrValue) bmrValue.textContent = result.bmr;
    if (tdeeValue) tdeeValue.textContent = result.tdee;
    if (lossCalories) lossCalories.textContent = result.lossCalories;
    if (maintainCalories) maintainCalories.textContent = result.maintainCalories;
    if (gainCalories) gainCalories.textContent = result.gainCalories;
    
    // Scroll para o resultado
    setTimeout(() => {
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    console.log('✅ TDEE calculado:', result);
  }
  
  clearTdeeForm() {
    const form = document.getElementById('tdee-form');
    const result = document.getElementById('tdee-result');
    
    if (form) form.reset();
    if (result) result.classList.add('hidden');
    
    this.showSuccess('Formulário limpo!');
  }
  
  // ========== FUNÇÕES UTILITÁRIAS ==========
  setupSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.saveCalculationToHistory(type);
      });
    });
  }
  
  setupActionButtons() {
    // Botões Compartilhar
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shareResult();
      });
    });
    
    // Botões Histórico
    document.querySelectorAll('.history-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showHistory();
      });
    });
  }
  
  saveToLocalStorage(type, data, result) {
    try {
      const history = JSON.parse(localStorage.getItem(`fitcalculator_${type}_history`) || '[]');
      
      const entry = {
        id: Date.now(),
        type,
        data,
        result,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      history.unshift(entry);
      
      // Limitar a 50 entradas
      if (history.length > 50) {
        history.pop();
      }
      
      localStorage.setItem(`fitcalculator_${type}_history`, JSON.stringify(history));
      
      this.showSuccess('Cálculo salvo no histórico!');
      console.log(`💾 Cálculo salvo: ${type}`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error);
      this.showError('Erro ao salvar cálculo');
    }
  }
  
  saveCalculationToHistory(type) {
    let data, result;
    
    switch(type) {
      case 'imc':
        const weight = document.getElementById('weight')?.value;
        const height = document.getElementById('height')?.value;
        if (weight && height) {
          data = { weight: parseFloat(weight), height: parseFloat(height) };
          result = this.calculateIMC(data);
          this.saveToLocalStorage(type, data, result);
        }
        break;
        
      case 'macros':
        const macrosWeight = document.getElementById('macros-weight')?.value;
        const activityLevel = document.getElementById('activity-level')?.value;
        const goal = document.getElementById('goal')?.value;
        const dietType = document.getElementById('diet-type')?.value;
        
        if (macrosWeight && activityLevel && goal) {
          data = {
            weight: parseFloat(macrosWeight),
            activityLevel,
            goal,
            dietType: dietType || 'balanced'
          };
          result = this.calculateMacros(data);
          this.saveToLocalStorage(type, data, result);
        }
        break;
        
      case 'tdee':
        const age = document.getElementById('tdee-age')?.value;
        const gender = document.getElementById('gender')?.value;
        const tdeeWeight = document.getElementById('tdee-weight')?.value;
        const tdeeHeight = document.getElementById('tdee-height')?.value;
        const tdeeActivity = document.getElementById('tdee-activity-level')?.value;
        
        if (age && gender && tdeeWeight && tdeeHeight && tdeeActivity) {
          data = {
            age: parseInt(age),
            gender,
            weight: parseFloat(tdeeWeight),
            height: parseFloat(tdeeHeight),
            activityLevel: tdeeActivity
          };
          result = this.calculateTDEE(data);
          this.saveToLocalStorage(type, data, result);
        }
        break;
    }
  }
  
  shareResult() {
    if (navigator.share) {
      navigator.share({
        title: 'Meu cálculo no FitCalculator',
        text: 'Calculei meu IMC/Macros/TDEE no FitCalculator!',
        url: window.location.href
      });
    } else {
      this.showSuccess('Link copiado para a área de transferência!');
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }
  
  showHistory() {
    alert('Histórico será implementado em breve!');
    // Você pode implementar um modal com o histórico aqui
  }
  
  showError(message) {
    // Remover mensagens anteriores
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Criar elemento de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <span>❌</span>
      <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remover após 4 segundos
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
      }
    }, 4000);
  }
  
  showSuccess(message) {
    // Remover mensagens anteriores
    document.querySelectorAll('.success-message').forEach(el => el.remove());
    
    // Criar elemento de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <span>✅</span>
      <span>${message}</span>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
      }
    }, 3000);
  }
}

// Inicializar automaticamente quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM carregado, inicializando CalculatorService...');
  
  try {
    const calculator = new CalculatorService();
    window.calculator = calculator; // Para debugging
    console.log('🎉 CalculatorService inicializado com sucesso!');
  } catch (error) {
    console.error('💥 Erro ao inicializar CalculatorService:', error);
  }
});