// Estado do app. Contas, perguntas e desempenho vêm do servidor (MySQL via api/*.php).
// Apenas os estudos continuam no localStorage.
window.App = { components: {}, pages: {} };

App.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

(() => {
  const KEY = "quiz-v3";
  const PTS = 260;
const DEFAULT_STUDIES = [
  {
    id: 101,
    name: "Gêneros brasileiros",
    studies: [
      {
        id: 1001,
        type: "text",
        title: "Samba: ritmo e comunidade",
        body: "O samba é um dos gêneros mais conhecidos da música brasileira e tem suas raízes nas tradições musicais africanas trazidas ao Brasil durante o período colonial. Ele se desenvolveu especialmente no Rio de Janeiro, no início do século XX, a partir de manifestações culturais das comunidades negras, que reuniam música, dança e percussão. Com o tempo, o samba se espalhou pelo país e ganhou diferentes formas, como o samba-enredo, o samba de roda e o partido-alto. Seus instrumentos possuem funções importantes na construção do ritmo: o surdo marca a pulsação grave, o pandeiro acrescenta diferentes marcações e o tamborim produz frases rítmicas mais agudas. Mais do que um gênero musical, o samba representa uma parte importante da cultura e da identidade brasileira."
      },
      {
        id: 1002,
        type: "review",
        title: "Revisão: samba",
        question: "Qual instrumento costuma marcar a pulsação grave de uma bateria de escola de samba?",
        options: ["Surdo", "Flauta", "Violino", "Guitarra"],
        answer: 0,
        explanation: "O surdo sustenta a pulsação grave e ajuda a conduzir a bateria."
      },
      {
        id: 1003,
        type: "text",
        title: "Bossa nova: suavidade e harmonia",
        body: "A bossa nova surgiu no final da década de 1950, principalmente na zona sul do Rio de Janeiro. O gênero nasceu da aproximação entre o samba brasileiro e elementos do jazz norte-americano, trazendo uma maneira diferente de trabalhar a harmonia, o ritmo e a interpretação vocal. Em vez de grandes arranjos e percussões muito intensas, a bossa nova costuma apresentar uma sonoridade mais suave e intimista. O violão ocupa um papel central, especialmente por seu acompanhamento rítmico característico, que combina acordes complexos com uma marcação sincopada. O piano também aparece com frequência, contribuindo para as harmonias elaboradas. A bossa nova ultrapassou as fronteiras brasileiras e influenciou músicos de diversos países."
      },
      {
        id: 1004,
        type: "text",
        title: "Choro: virtuosismo e tradição",
        body: "O choro é um dos gêneros instrumentais mais antigos da música popular brasileira. Surgiu no Rio de Janeiro durante a segunda metade do século XIX, a partir do contato entre danças europeias, como a polca, e ritmos e formas de interpretação afro-brasileiros. Apesar do nome, o choro não é necessariamente uma música triste. Pelo contrário, muitas composições apresentam melodias alegres, rápidas e bastante elaboradas. O conjunto tradicional costuma reunir instrumentos como cavaquinho, violão, flauta e bandolim. O cavaquinho contribui para a marcação rítmica e harmônica, enquanto a flauta e o bandolim frequentemente executam melodias ornamentadas. O gênero exige bastante domínio técnico dos instrumentos e valoriza a interação entre os músicos."
      }
    ]
  },
  {
    id: 102,
    name: "Rock e suas vertentes",
    studies: [
      {
        id: 2001,
        type: "text",
        title: "A linguagem do rock",
        body: "O rock surgiu nos Estados Unidos durante a década de 1950, a partir da combinação de estilos como rhythm and blues, blues e country. Inicialmente, ganhou popularidade por seu ritmo marcante, pela presença da guitarra elétrica e por uma sonoridade mais energética. Durante as décadas seguintes, o gênero se espalhou pelo mundo e passou por inúmeras transformações, incorporando influências de diferentes culturas e movimentos musicais. A formação mais tradicional de uma banda de rock reúne guitarra elétrica, contrabaixo e bateria, mas também é comum encontrar teclados e outros instrumentos. A guitarra pode acompanhar a harmonia ou executar riffs e solos. Ao longo de sua história, o rock deu origem a diversas vertentes, como hard rock, punk rock, grunge e heavy metal."
      },
      {
        id: 2002,
        type: "review",
        title: "Revisão: rock",
        question: "Qual instrumento costuma conduzir riffs e solos no rock?",
        options: ["Guitarra elétrica", "Harpa", "Clarinete", "Berimbau"],
        answer: 0,
        explanation: "A guitarra elétrica é conhecida pelos riffs e solos, embora o rock tenha muitas formações diferentes."
      },
      {
        id: 2003,
        type: "text",
        title: "Heavy metal: peso e intensidade",
        body: "O heavy metal se desenvolveu no final da década de 1960 e no início dos anos 1970, principalmente no Reino Unido e nos Estados Unidos, a partir de elementos do blues rock e do hard rock. O gênero ficou conhecido por sua sonoridade pesada, guitarras distorcidas, riffs marcantes, bateria intensa e linhas de baixo bastante presentes. Uma característica importante é a variedade de suas vertentes. O thrash metal costuma apresentar velocidade elevada e riffs agressivos; o doom metal trabalha com andamentos geralmente mais lentos e atmosferas densas; já o death metal é conhecido por sua sonoridade extrema e vocais guturais. Os instrumentos mais comuns são guitarra elétrica, contrabaixo e bateria. O heavy metal se espalhou internacionalmente e desenvolveu cenas musicais próprias em diversos países, inclusive no Brasil."
      },
      {
        id: 2004,
        type: "text",
        title: "Grunge: o som de Seattle",
        body: "O grunge surgiu na década de 1980, na região de Seattle, no estado de Washington, nos Estados Unidos. O gênero se desenvolveu principalmente na cena musical independente da cidade, reunindo influências do punk rock e do heavy metal. Sua sonoridade costuma apresentar guitarras distorcidas, riffs marcantes, mudanças de intensidade e uma produção que muitas vezes valoriza um som mais cru. Durante o início dos anos 1990, o grunge ganhou projeção internacional e ajudou a colocar Seattle no centro da música alternativa. Além das características musicais, o movimento ficou associado a uma estética mais despojada e a uma abordagem diferente daquela adotada por parte do hard rock comercial da época. A cena grunge é um exemplo de como uma região pode desenvolver uma identidade musical própria e influenciar o cenário internacional."
      },
      {
        id: 2005,
        type: "text",
        title: "Punk rock: velocidade e atitude",
        body: "O punk rock ganhou força durante a década de 1970, especialmente nos Estados Unidos e no Reino Unido. O gênero surgiu como uma reação à complexidade e ao caráter cada vez mais elaborado de parte do rock da época. Suas músicas geralmente apresentam estruturas mais simples, andamento acelerado, guitarras distorcidas e letras diretas. A formação tradicional utiliza guitarra, baixo e bateria, com vocais frequentemente mais agressivos. Além da música, o punk desenvolveu uma forte identidade cultural, associada à atitude independente, à produção musical fora das grandes gravadoras e à crítica social. Posteriormente, surgiram diversas vertentes, como hardcore punk, pop punk e post-punk."
      }
    ]
  },
  {
    id: 103,
    name: "Instrumentos musicais",
    studies: [
      {
        id: 3001,
        type: "text",
        title: "Famílias de instrumentos",
        body: "Uma maneira interessante de conhecer os instrumentos musicais é observar como cada um produz seu som. Os instrumentos de cordas utilizam a vibração de cordas tensionadas, como acontece no violino e no violão. Os instrumentos de sopro produzem som a partir da vibração de uma coluna de ar, como a flauta, o saxofone e o trompete. Já os instrumentos de percussão produzem sons por meio de impactos, agitação ou fricção, como acontece com a bateria, o pandeiro e o tamborim. Essas classificações ajudam a compreender as diferenças entre os instrumentos, mas também existem particularidades: o piano, por exemplo, possui cordas que são golpeadas por martelos acionados pelas teclas."
      },
      {
        id: 3002,
        type: "review",
        title: "Revisão: instrumentos",
        question: "Qual destes instrumentos pertence à família das madeiras?",
        options: ["Flauta", "Trompete", "Tímpano", "Violoncelo"],
        answer: 0,
        explanation: "A flauta é classificada como instrumento de sopro da família das madeiras."
      },
      {
        id: 3003,
        type: "text",
        title: "Instrumentos de percussão",
        body: "Os instrumentos de percussão estão entre os mais antigos utilizados pela humanidade e aparecem em manifestações musicais de praticamente todas as culturas. Sua produção sonora geralmente envolve golpes, agitação ou fricção de diferentes materiais, como madeira, metal e membranas. No Brasil, esses instrumentos possuem uma presença muito forte em gêneros como samba, maracatu e forró. O pandeiro possui uma membrana e pequenas placas metálicas chamadas platinelas, que produzem sons diferentes conforme a maneira de tocar. O surdo é um tambor de grandes dimensões que produz frequências graves e ajuda a sustentar a pulsação do samba. Já o cajón é uma caixa de percussão originária do Peru, tocada com as mãos e utilizada em diferentes estilos musicais."
      },
      {
        id: 3004,
        type: "text",
        title: "Bateria: ritmo e coordenação",
        body: "A bateria é um conjunto de instrumentos de percussão organizado para ser tocado por uma única pessoa. Sua configuração mais comum reúne bumbo, caixa, tons, surdo de chão, pratos e chimbal. Cada componente possui uma função: o bumbo produz sons graves, a caixa apresenta uma sonoridade mais aguda e marcante, e os pratos acrescentam diferentes texturas ao ritmo. A bateria moderna se desenvolveu principalmente nos Estados Unidos, no início do século XX, quando músicos começaram a reunir diferentes peças de percussão em um único conjunto. Atualmente, é muito utilizada no rock, jazz, pop, metal e diversos outros gêneros."
      }
    ]
  },
  {
    id: 104,
    name: "Instrumentos de cordas",
    studies: [
      {
        id: 4001,
        type: "text",
        title: "Violino: precisão e expressividade",
        body: "O violino é um instrumento de cordas friccionadas que possui uma longa história na música europeia. Seu formato moderno se consolidou na Itália durante o século XVI, e o instrumento passou a ocupar uma posição central nas orquestras e na música de câmara. Ele possui quatro cordas, afinadas em Sol, Ré, Lá e Mi, da mais grave para a mais aguda. Tradicionalmente, o músico utiliza um arco para friccionar as cordas e produzir vibrações, mas também pode tocá-las diretamente com os dedos, técnica conhecida como pizzicato. O violino é muito associado à música erudita, mas também aparece no folk, no jazz e em diferentes tradições populares. Seu timbre agudo e expressivo permite executar melodias rápidas, passagens delicadas e notas sustentadas."
      },
      {
        id: 4002,
        type: "text",
        title: "Violão: cordas e harmonia",
        body: "O violão é um instrumento de cordas dedilhadas bastante presente na música brasileira e em diversas tradições musicais do mundo. Sua história está relacionada à evolução de antigos instrumentos de cordas europeus, e o modelo moderno de violão clássico se desenvolveu na Espanha durante o século XIX. O instrumento convencional possui seis cordas, que podem ser tocadas com os dedos ou com uma palheta. Sua caixa de ressonância amplifica naturalmente o som produzido pelas cordas. No Brasil, o violão ocupa um papel importante no samba, na bossa nova, no choro e na música sertaneja. Também pode ser encontrado em apresentações solo, acompanhando a voz ou executando melodias e arranjos mais complexos."
      },
      {
        id: 4003,
        type: "text",
        title: "Contrabaixo: a base grave",
        body: "O contrabaixo é um instrumento responsável por produzir as frequências graves que ajudam a sustentar a música. Na música popular, o baixo elétrico se tornou especialmente importante a partir da segunda metade do século XX, quando passou a substituir ou complementar o contrabaixo acústico em muitas formações. O modelo mais comum possui quatro cordas, geralmente afinadas em Mi, Lá, Ré e Sol, da mais grave para a mais aguda. Apesar de sua função frequentemente ser acompanhar a harmonia, o baixo também pode executar melodias e solos. No rock, trabalha em conjunto com a bateria para formar uma base rítmica consistente. No reggae, suas linhas graves costumam ganhar ainda mais destaque, enquanto no jazz é comum encontrar linhas improvisadas e bastante elaboradas."
      },
      {
        id: 4004,
        type: "text",
        title: "Cavaquinho e bandolim",
        body: "O cavaquinho e o bandolim são instrumentos de cordas dedilhadas que possuem tamanhos relativamente pequenos, mas desempenham funções importantes em diferentes gêneros musicais. O cavaquinho é muito utilizado no samba e no choro, especialmente para executar acompanhamentos rítmicos e acordes. Já o bandolim possui um timbre mais brilhante e costuma ser utilizado em melodias e solos. Ambos possuem uma história relacionada à tradição dos instrumentos de cordas europeus, mas foram incorporados e adaptados às culturas musicais de diferentes regiões. No Brasil, tornaram-se especialmente importantes no desenvolvimento do choro e de outras manifestações da música popular."
      }
    ]
  },
  {
    id: 105,
    name: "Guitarra elétrica",
    studies: [
      {
        id: 5001,
        type: "text",
        title: "Como funciona a guitarra elétrica?",
        body: "A guitarra elétrica se popularizou durante o século XX e transformou profundamente a música popular. Diferentemente do violão acústico, ela utiliza captadores magnéticos para converter a vibração das cordas metálicas em sinais elétricos. Esses sinais são enviados a um amplificador, que aumenta o volume e permite modificar o timbre do instrumento. Existem diferentes tipos de guitarra, com formatos, construções e características sonoras variadas. Modelos de corpo sólido são muito utilizados no rock e no metal, enquanto guitarras semiacústicas aparecem bastante no jazz e em outros estilos. A guitarra elétrica tornou-se especialmente importante nos Estados Unidos durante o desenvolvimento do blues e do rock."
      },
      {
        id: 5002,
        type: "text",
        title: "Riffs, solos e distorção",
        body: "A guitarra elétrica oferece diversas possibilidades de execução e expressão musical. Um riff é uma sequência de notas ou acordes geralmente curta e marcante, que costuma se repetir ao longo de uma música. Já o solo é um trecho em que o instrumento ganha destaque melódico, explorando técnicas como bends, vibratos, slides e ligados. Outro elemento muito associado à guitarra é a distorção, um efeito que modifica o sinal elétrico e acrescenta saturação e harmônicos ao som. Essa característica se tornou especialmente importante no desenvolvimento do rock e do heavy metal. Existem diferentes níveis de saturação: o overdrive costuma produzir uma sonoridade mais suave, enquanto a distorção tradicional pode gerar um timbre mais agressivo."
      },
      {
        id: 5003,
        type: "text",
        title: "Timbres e efeitos",
        body: "Além das características naturais de cada guitarra, os músicos podem modificar bastante seu som utilizando pedais e processadores de efeitos. A distorção e o overdrive acrescentam saturação ao sinal, criando timbres muito utilizados no rock e no metal. O delay reproduz o som original após pequenos intervalos, criando repetições semelhantes a ecos. O chorus combina pequenas variações de tempo e afinação para produzir uma sensação de duplicação do instrumento. Já o wah altera as frequências destacadas conforme o movimento de um pedal. Também existem efeitos como reverb, phaser e flanger, cada um com uma maneira diferente de modificar o timbre."
      },
      {
        id: 5004,
        type: "text",
        title: "Guitarra no blues e no rock",
        body: "A guitarra elétrica teve um papel fundamental na transformação do blues e no surgimento do rock. No blues, o instrumento ganhou destaque por sua capacidade de reproduzir frases expressivas, utilizando técnicas como bends e slides. Com o desenvolvimento do rock, passou a ser utilizada também em riffs mais marcantes e solos de maior intensidade. Posteriormente, o instrumento se tornou uma das principais marcas do hard rock e do heavy metal, com o uso de amplificadores de alta potência e diferentes níveis de distorção. Apesar dessa associação com estilos mais pesados, a guitarra também aparece em gêneros como jazz, reggae, funk, pop e música brasileira."
      }
    ]
  },
  {
    id: 106,
    name: "Instrumentos de sopro",
    studies: [
      {
        id: 6001,
        type: "text",
        title: "Metais: o poder dos instrumentos de sopro",
        body: "Os instrumentos da família dos metais possuem uma característica de funcionamento bastante particular: o som é produzido pela vibração dos lábios do músico em um bocal. Entre os principais representantes estão o trompete, o trombone, a trompa e a tuba. O trompete costuma executar melodias agudas e marcantes, enquanto a tuba trabalha principalmente na região grave. O trombone possui uma vara móvel que permite modificar continuamente a extensão do tubo e, consequentemente, a altura das notas. Esses instrumentos possuem grande importância em orquestras, bandas e fanfarras. Também aparecem em gêneros populares, como jazz, salsa, frevo e diversos estilos de música brasileira."
      },
      {
        id: 6002,
        type: "text",
        title: "Madeiras: diferentes formas de soprar",
        body: "A família das madeiras reúne instrumentos de sopro que utilizam diferentes mecanismos para produzir vibrações sonoras. Apesar do nome, nem todos são construídos de madeira: o saxofone, por exemplo, normalmente é feito de metal, mas pertence a essa família por causa de seu mecanismo de produção sonora. A flauta transversal utiliza a passagem do ar contra uma abertura, enquanto o clarinete utiliza uma palheta simples. O oboé e o fagote, por sua vez, utilizam palhetas duplas. Esses instrumentos aparecem principalmente em orquestras e conjuntos de música de câmara, mas também possuem espaço em estilos populares. O saxofone, por exemplo, tornou-se um dos instrumentos mais conhecidos do jazz."
      },
      {
        id: 6003,
        type: "text",
        title: "Saxofone: versatilidade sonora",
        body: "O saxofone foi criado pelo inventor belga Adolphe Sax durante a década de 1840. Apesar de ser construído geralmente em metal, pertence à família das madeiras porque utiliza uma palheta simples para produzir som, assim como o clarinete. Existem diferentes tamanhos de saxofone, sendo os mais conhecidos o soprano, o alto, o tenor e o barítono. Cada um possui uma extensão e um timbre próprios. O instrumento ganhou destaque nas bandas militares e posteriormente se tornou muito importante no jazz, especialmente nos estilos desenvolvidos nos Estados Unidos. Também aparece no blues, no rock, no funk e em diversas formações de música popular."
      }
    ]
  },
  {
    id: 107,
    name: "Gêneros musicais internacionais",
    studies: [
      {
        id: 7001,
        type: "text",
        title: "Jazz: improvisação e liberdade",
        body: "O jazz surgiu no final do século XIX e no início do século XX, especialmente em Nova Orleans, nos Estados Unidos. Sua formação envolveu tradições musicais afro-americanas, incluindo blues e ragtime, além de influências de diferentes culturas presentes na região. Uma de suas características mais conhecidas é a improvisação, que permite aos músicos criar novas melodias e variações durante a execução. O jazz também é marcado pelo uso de harmonias elaboradas, síncopes e diferentes formas de interação entre os instrumentos. Saxofone, trompete, piano, contrabaixo e bateria são bastante comuns em suas formações. Ao longo do século XX, o gênero se desenvolveu em diferentes vertentes, como swing, bebop, cool jazz e fusion."
      },
      {
        id: 7002,
        type: "text",
        title: "Blues: origem e expressão",
        body: "O blues se desenvolveu entre comunidades afro-americanas do sul dos Estados Unidos, especialmente na região do delta do rio Mississippi, durante o final do século XIX e o início do século XX. Suas raízes estão ligadas a tradições musicais africanas, cantos de trabalho e outras manifestações culturais desenvolvidas pela população negra. O gênero costuma apresentar estruturas harmônicas recorrentes, frases melódicas expressivas e uma interpretação vocal bastante característica. A guitarra e a gaita são instrumentos muito associados ao blues, embora piano e outros instrumentos também sejam utilizados. Uma característica importante é o uso das chamadas blue notes, notas executadas com alterações de altura que contribuem para sua sonoridade particular. O blues influenciou diretamente o desenvolvimento do jazz, do rhythm and blues e do rock."
      },
      {
        id: 7003,
        type: "text",
        title: "Reggae: ritmo jamaicano",
        body: "O reggae surgiu na Jamaica no final da década de 1960, a partir de estilos musicais jamaicanos anteriores, como ska e rocksteady. Sua sonoridade é marcada por uma organização rítmica característica, na qual a guitarra e os teclados frequentemente realizam marcações nos tempos fracos dos compassos. O contrabaixo elétrico também possui grande destaque, apresentando linhas graves que muitas vezes conduzem a música. A bateria completa essa base com padrões rítmicos próprios. Embora tenha se desenvolvido na Jamaica, o reggae ganhou popularidade internacional e passou a influenciar músicos de diferentes países. O gênero também possui diversas vertentes, como roots reggae e dub."
      },
      {
        id: 7004,
        type: "text",
        title: "Country: a música rural norte-americana",
        body: "O country se desenvolveu nos Estados Unidos, especialmente nas regiões rurais do sul e dos montes Apalaches, durante o início do século XX. Sua formação recebeu influências de tradições musicais europeias, principalmente de imigrantes britânicos e irlandeses, além de elementos de outras manifestações populares norte-americanas. Entre seus instrumentos característicos estão o violão, o banjo, a guitarra pedal steel, o violino e a gaita. O gênero apresenta diferentes vertentes, que vão desde formas tradicionais e acústicas até versões mais modernas, com guitarras elétricas e produção de estúdio. O country também possui uma forte relação com a música e a cultura de regiões rurais dos Estados Unidos."
      },
      {
        id: 7005,
        type: "text",
        title: "Salsa: ritmos do Caribe",
        body: "A salsa é um gênero musical desenvolvido principalmente em comunidades latino-americanas de Nova York durante as décadas de 1960 e 1970, reunindo diversas tradições musicais caribenhas, especialmente de Cuba e Porto Rico. Sua sonoridade combina ritmos afro-cubanos, harmonias e instrumentos de diferentes origens. Entre os instrumentos mais comuns estão congas, bongôs, timbales, piano, baixo e metais, como trompetes e trombones. A música costuma apresentar uma forte interação entre a seção rítmica e os instrumentos melódicos. A salsa também está associada à dança em pares e se tornou bastante popular em diferentes países da América Latina e do mundo."
      }
    ]
  },
  {
    id: 108,
    name: "Ritmos e instrumentos brasileiros",
    studies: [
      {
        id: 8001,
        type: "text",
        title: "Forró: tradição nordestina",
        body: "O forró é um conjunto de manifestações musicais e dançantes muito associado à região Nordeste do Brasil. Sua história está ligada às festas populares e às tradições culturais nordestinas, tendo ganhado grande projeção nacional durante o século XX. Entre suas principais vertentes estão o baião, o xote e o arrasta-pé, que apresentam diferenças de andamento e organização rítmica. Uma formação tradicional bastante conhecida é o trio pé de serra, composto por sanfona, zabumba e triângulo. A sanfona costuma conduzir as melodias e harmonias, enquanto a zabumba sustenta a marcação grave e o triângulo acrescenta uma pulsação aguda e constante. O forró continua sendo uma das expressões musicais mais importantes do Nordeste e está especialmente presente nas festas juninas."
      },
      {
        id: 8002,
        type: "text",
        title: "Frevo: energia e velocidade",
        body: "O frevo surgiu em Pernambuco, especialmente no Recife e em Olinda, durante o final do século XIX e o início do século XX. Seu desenvolvimento está diretamente relacionado às manifestações carnavalescas e às bandas militares e populares que circulavam pelas ruas. Musicalmente, o frevo é conhecido pelo andamento acelerado, pelas melodias intensas e pela presença marcante de instrumentos de sopro, como trompetes, trombones e saxofones. A percussão também participa da construção de seu ritmo característico. Existem diferentes formas de frevo, incluindo o frevo de rua, o frevo-canção e o frevo de bloco. A manifestação também está associada à sombrinha colorida e aos movimentos acrobáticos da dança."
      },
      {
        id: 8003,
        type: "text",
        title: "Maracatu: tradição e percussão",
        body: "O maracatu é uma manifestação cultural afro-brasileira muito associada ao estado de Pernambuco, especialmente à região metropolitana do Recife. Sua história está ligada às tradições das populações negras e às antigas coroações de reis e rainhas do Congo, que se desenvolveram durante o período colonial. No maracatu de baque virado, a música é construída principalmente por instrumentos de percussão. A alfaia, um grande tambor de madeira com membranas de couro, possui papel central na marcação rítmica. Também são utilizados instrumentos como o gonguê, a caixa e o ganzá. Além da música, o maracatu envolve cortejos, personagens tradicionais, vestimentas elaboradas e elementos simbólicos importantes para a cultura afro-brasileira."
      },
      {
        id: 8004,
        type: "text",
        title: "Música caipira e viola",
        body: "A música caipira possui raízes nas tradições rurais do interior do Brasil, especialmente em regiões dos estados de São Paulo, Minas Gerais, Goiás, Paraná e Mato Grosso. Seu desenvolvimento está relacionado às manifestações culturais do campo, às festas religiosas e às tradições de comunidades rurais. A viola caipira é um dos instrumentos mais característicos desse universo musical, geralmente possuindo dez cordas organizadas em cinco pares. Ela é utilizada tanto para acompanhar o canto quanto para executar melodias e introduções instrumentais. Com o passar do tempo, a música caipira também influenciou o desenvolvimento do sertanejo, que incorporou novos instrumentos, estilos de interpretação e elementos de outros gêneros populares."
      }
    ]
  },
  {
    id: 109,
    name: "Piano e instrumentos de teclas",
    studies: [
      {
        id: 9001,
        type: "text",
        title: "Piano: cordas e martelos",
        body: "O piano é um dos instrumentos de teclas mais conhecidos do mundo e possui um mecanismo bastante interessante. Quando uma tecla é pressionada, um sistema interno movimenta um pequeno martelo que golpeia uma corda, produzindo vibrações que são amplificadas pela estrutura do instrumento. Apesar de ser tocado por meio de teclas, o piano é classificado como um instrumento de cordas percutidas. Sua versão moderna se desenvolveu principalmente na Europa durante o século XVIII, a partir de instrumentos anteriores, como o cravo e o clavicórdio. O piano possui uma grande extensão de notas e permite executar melodias, harmonias e acompanhamentos simultaneamente. Por isso, aparece na música erudita, no jazz, blues, pop e rock."
      },
      {
        id: 9002,
        type: "text",
        title: "Órgão e sintetizador",
        body: "Os instrumentos de teclas possuem diferentes formas de produzir som, e o órgão e o sintetizador são bons exemplos dessa variedade. O órgão tradicional de tubos utiliza o ar que passa por tubos de diferentes tamanhos para produzir notas musicais. Já os órgãos eletrônicos reproduzem ou sintetizam esses timbres por meio de circuitos. O sintetizador, por sua vez, utiliza recursos eletrônicos ou digitais para gerar, modificar e combinar sons. Ele pode reproduzir timbres semelhantes aos de instrumentos acústicos ou criar sonoridades completamente novas. Os sintetizadores ganharam destaque especialmente durante o século XX, com sua utilização na música eletrônica, no pop e no rock progressivo."
      },
      {
        id: 9003,
        type: "text",
        title: "Cravo: um instrumento anterior ao piano",
        body: "O cravo é um instrumento de teclas bastante utilizado na música europeia entre os séculos XVI e XVIII, especialmente durante o período barroco. Diferentemente do piano, suas cordas não são golpeadas por martelos, mas pinçadas por pequenas peças internas chamadas saltadores. Essa diferença produz um som mais brilhante e com menor variação de intensidade conforme a força utilizada nas teclas. O cravo foi muito importante na música de câmara e nas orquestras barrocas, sendo posteriormente substituído em muitas situações pelo piano, que permitia maior controle sobre a dinâmica sonora. Atualmente, continua sendo utilizado em apresentações de música antiga e em interpretações historicamente orientadas."
      }
    ]
  },
  {
    id: 110,
    name: "Teoria musical e ritmo",
    studies: [
      {
        id: 10001,
        type: "text",
        title: "Notas e escalas musicais",
        body: "A teoria musical utiliza um conjunto de conceitos para organizar os sons e compreender como eles se relacionam. Na música ocidental, as sete notas naturais são Dó, Ré, Mi, Fá, Sol, Lá e Si. Essas notas podem ser organizadas em escalas, que servem de base para a construção de melodias e harmonias. Além delas, existem os acidentes musicais, como sustenidos e bemóis, que alteram a altura das notas. Uma escala pode apresentar diferentes intervalos entre seus graus, criando sonoridades características. As escalas maiores e menores são bastante utilizadas em diferentes gêneros, desde a música erudita até o rock e o jazz."
      },
      {
        id: 10002,
        type: "text",
        title: "Andamento e metrônomo",
        body: "O andamento representa a velocidade com que uma música é executada. Ele pode ser indicado por termos tradicionais, como adagio, moderato e allegro, ou por uma medida numérica chamada BPM, sigla para batidas por minuto. Uma música com 60 BPM possui uma marcação de aproximadamente uma batida por segundo, enquanto uma com 120 BPM apresenta duas batidas por segundo. O metrônomo é utilizado para produzir marcações regulares e ajudar o músico a manter a velocidade durante os estudos. Esse recurso é especialmente importante para desenvolver precisão rítmica, melhorar a execução de passagens difíceis e trabalhar a sincronização entre instrumentos."
      },
      {
        id: 10003,
        type: "text",
        title: "Ritmo, compasso e pulsação",
        body: "O ritmo é a organização dos sons e dos silêncios ao longo do tempo. A pulsação funciona como uma referência regular que ajuda os músicos a manterem a organização da música. Já o compasso divide essa pulsação em grupos, organizando os tempos de maneira recorrente. Um exemplo bastante comum é o compasso 4/4, no qual cada grupo possui quatro tempos. Também existem compassos como 3/4 e 6/8, que apresentam outras formas de organização. Esses conceitos ajudam a compreender por que diferentes gêneros possuem sensações rítmicas distintas e são fundamentais para tocar em conjunto."
      },
      {
        id: 10004,
        type: "text",
        title: "Harmonia e acordes",
        body: "A harmonia está relacionada à combinação de diferentes notas tocadas simultaneamente. Os acordes são formados pela reunião de notas que produzem uma sonoridade conjunta e podem servir de acompanhamento para uma melodia. Na música ocidental, os acordes maiores e menores estão entre os mais utilizados, apresentando diferenças na organização dos intervalos entre suas notas. Instrumentos como violão, guitarra e piano permitem executar acordes com facilidade, sendo muito utilizados para acompanhar outros instrumentos e vozes. No jazz, é comum encontrar acordes mais complexos, com sétimas, nonas e outras extensões, enquanto diferentes estilos populares podem utilizar progressões harmônicas mais simples e repetitivas."
      }
    ]
  }
];


  let data = { studies: DEFAULT_STUDIES };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem("quiz-v2")) || {};
    if (Array.isArray(saved.studies)) data.studies = saved.studies;
  } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ studies: data.studies }));
      localStorage.removeItem("quiz-v2");
    } catch (e) {}
  };
  save();

  // Estado vindo do servidor (nunca persistido no navegador)
  let session = null;
  let csrf = "";
  let questions = [];
  let stats = { ok: 0, err: 0, points: 0 };
  let statsError = "";
  let leaderboard = [];
  let leaderboardError = "";

  async function api(url, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (csrf) headers["X-CSRF-Token"] = csrf;
    let res;
    try {
      res = await fetch(url, { method, headers, credentials: "same-origin", body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (e) {
      throw new Error("Não foi possível conectar ao servidor.");
    }
    let json = {};
    try { json = await res.json(); } catch (e) {}
    if (!res.ok) {
      const err = new Error(json.error || "Erro ao falar com o servidor.");
      err.status = res.status;
      throw err;
    }
    return json;
  }
  const applyAuth = r => { session = r.user || null; if (r.csrf) csrf = r.csrf; };

  App.store = {
    PTS,
    get questions() { return questions; },
    get studies() { return data.studies; },
    get stats() { return stats; },
    get statsError() { return statsError; },
    get leaderboard() { return leaderboard; },
    get leaderboardError() { return leaderboardError; },
    get session() { return session; },
    get isAdmin() { return session?.role === "admin"; },

    // Carrega sessão, perguntas e desempenho do servidor
    async init() {
      try { applyAuth(await api("api/auth.php?action=me")); } catch (e) { console.error(e); }
      await this.loadQuestions();
      await this.loadStats();
    },
    async loadQuestions() {
      try { questions = (await api("api/questions.php")).questions; }
      catch (e) { console.error(e); questions = []; }
      return questions;
    },
    async loadStats() {
      try {
        const result = await api("api/ranking.php");
        stats = result.stats;
        leaderboard = result.ranking;
        statsError = "";
        leaderboardError = "";
      } catch (e) {
        statsError = e.message;
        leaderboardError = e.message;
        console.error(e);
      }
    },

    // Autenticação — retorna { session } ou { error }
    async login(email, pass, as = "user") {
      email = email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Digite um e-mail válido." };
      if (!pass) return { error: "Digite sua senha." };
      try {
        applyAuth(await api("api/auth.php?action=login", { method: "POST", body: { email, pass, as } }));
        stats = { ok: 0, err: 0, points: 0 };
        await this.loadStats();
        return { session };
      }
      catch (e) { return { error: e.message }; }
    },
    async register(name, email, pass) {
      name = name.trim(); email = email.trim().toLowerCase();
      if (!name) return { error: "Informe seu nome." };
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Digite um e-mail válido." };
      if (pass.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
      try {
        applyAuth(await api("api/auth.php?action=register", { method: "POST", body: { name, email, pass } }));
        stats = { ok: 0, err: 0, points: 0 };
        await this.loadStats();
        return { session };
      }
      catch (e) { return { error: e.message }; }
    },
    async logout() {
      try {
        applyAuth(await api("api/auth.php?action=logout", { method: "POST", body: {} }));
        stats = { ok: 0, err: 0, points: 0 };
        await this.loadStats();
      } catch (e) {
        session = null;
        stats = { ok: 0, err: 0, points: 0 };
        leaderboard = [];
      }
    },

    async addResult(ok, err) {
      if (session?.role !== "user") return { recorded: false };
      const result = await api("api/ranking.php", { method: "POST", body: { ok, err } });
      stats = result.stats;
      statsError = "";
      await this.loadStats();
      return { recorded: true };
    },
    async resetStats() {
      if (session?.role !== "user") {
        stats = { ok: 0, err: 0, points: 0 };
        return;
      }
      const result = await api("api/ranking.php", { method: "DELETE", body: {} });
      stats = result.stats;
      statsError = "";
      await this.loadStats();
    },

    // CRUD de perguntas (admin) — lançam Error com a mensagem do servidor
    async saveQuestion(q) {
      const body = { q: q.q, o: q.o, a: q.a };
      if (q.id) await api("api/questions.php?id=" + encodeURIComponent(q.id), { method: "PUT", body });
      else await api("api/questions.php", { method: "POST", body });
      await this.loadQuestions();
    },
    async deleteQuestion(id) {
      await api("api/questions.php?id=" + encodeURIComponent(id), { method: "DELETE" });
      await this.loadQuestions();
    },

    saveTheme(theme) {
      const current = data.studies.find(item => item.id === theme.id);
      if (current) current.name = theme.name;
      else {
        const created = { id: Date.now(), name: theme.name, studies: [] };
        data.studies.push(created);
        save();
        return created;
      }
      save();
      return current;
    },
    deleteTheme(id) {
      data.studies = data.studies.filter(theme => theme.id !== id);
      save();
    },
    saveStudy(themeId, study) {
      const theme = data.studies.find(item => item.id === themeId);
      if (!theme) return null;
      const current = theme.studies.find(item => item.id === study.id);
      if (current) Object.assign(current, study);
      else {
        study.id = Date.now();
        theme.studies.push(study);
      }
      save();
      return current || study;
    },
    deleteStudy(themeId, studyId) {
      const theme = data.studies.find(item => item.id === themeId);
      if (!theme) return;
      theme.studies = theme.studies.filter(study => study.id !== studyId);
      save();
    },
  };
})();
