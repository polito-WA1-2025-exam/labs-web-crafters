function Picture(picture_Id, picture_Desc, picture_Path){
    this.picture_Id = picture_Id;
    this.picture_Desc = picture_Desc;
    this.picture_Path = picture_Path;
}

function Caption(caption_Id, caption_Text){
    this.caption_Id = caption_Id;
    this.caption_Text = caption_Text;
}

function Round(round_Id, round_Date, round_Pictures){
    this.round_Id = round_Id;
    this.round_Date = round_Date;
    this.round_Pictures = round_Pictures;
}

function PictureWrapper(){
    arrayPictures = [];

    this.add = (picture) => {
        arrayPictures.push(picture);
    }

    this.filter = (picture_Id) => {
        return arrayPictures.filter((picture) => picture.picture_Id === picture_Id);
    }

    this.remove = (picture_Id) => {
        arrayPictures = arrayPictures.filter((picture) => picture.picture_Id !== picture_Id);
    }
}

function CaptionWrapper(){
    arrayCaptions = [];

    this.add = (caption) => {
        arrayCaptions.push(caption);
    }

    this.filter = (caption_Id) => {
        return arrayCaptions.filter((caption) => caption.caption_Id === caption_Id);
    }

    this.remove = (caption_Id) => {
        arrayCaptions = arrayCaptions.filter((caption) => caption.caption_Id !== caption_Id);
    }

    this.sort = () => {
        arrayCaptions.sort((a, b) => a.caption_Id - b.caption_Id);
    }
}

function RoundWrapper(){
    arrayRounds = [];

    this.add = (round) => {
        arrayRounds.push(round);
    }

    this.filter = (round_Id) => {
        return arrayRounds.filter((round) => round.round_Id === round_Id);
    }

    this.remove = (round_Id) => {
        arrayRounds = arrayRounds.filter((round) => round.round_Id !== round_Id);
    }
}

function Score(caption_Id, picture_Id, score_Value){
    this.caption_Id = caption_Id;
    this.picture_Id = picture_Id;
    this.score_Value = score_Value;
}