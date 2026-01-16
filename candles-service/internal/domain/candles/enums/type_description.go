package enums

func (c CandleType) GetDescription() string {
	descriptions := map[CandleType]string{
		CandleTypeWhite:  "Simboliza a ressurreição, a paz, a alma pura, a alegria. Usa-se: na Quinta-feira Santa, na Vigília Pascal do Sábado Santo, em todo o Tempo Pascal, no Natal, no Tempo do Natal, nas festas de Nossa Senhora e dos Santos (quando não mártires) e nas festas do Senhor (exceto as da Paixão).",
		CandleTypeRed:    "É usado: no Domingo de Ramos e da Paixão, na Sexta-Feira da Paixão, no Domingo de Pentecostes, pois lembra o fogo do Espírito Santo, nas festas dos Apóstolos, dos Santos Mártires e dos Evangelistas. Simboliza o fogo do amor, da caridade ou do martírio (lembrando o sangue dos Mártires).",
		CandleTypeGreen:  "É a cor da esperança. Usa-se no Tempo Comum.",
		CandleTypePurple: "Simboliza a penitência. Usa-se no Tempo do Advento e da Quaresma. Pode-se também usar nos ofícios e missas pelos mortos e no Sacramento da confissão.",
		CandleTypePink:   "Simboliza a alegria. Pode ser usado no 3º Domingo do Advento, chamado 'Gaudete', e no 4º Domingo da Quaresma, chamado 'Laetare', ambos domingos da alegria. Simboliza a alegria, dentro de um tempo destinado à penitência.",
	}

	if desc, ok := descriptions[c]; ok {
		return desc
	}

	return ""
}