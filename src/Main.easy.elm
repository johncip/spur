module Main exposing (main, update, view)

import Browser
import Html exposing (Html, text)


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initModel
        , update = update
        , view = view
        }


initModel =
    Model 0


type Msg
    = NoOp


type alias Model =
    { number : Int }


update : Msg -> Model -> Model
update msg model =
    model


view : model -> Html msg
view model =
    text "Hello"
