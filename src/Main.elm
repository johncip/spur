module Main exposing (main)

import Browser
import Html exposing (Html, a, button, div, hr, img, text)
import Html.Attributes exposing (class, classList, href, id, src, type_)



-- MODEL


initModel =
    Model "foo"


type alias Model =
    { data : String }



-- UPDATE


type Action
    = NoOp


update : Action -> Model -> Model
update action model =
    case action of
        NoOp ->
            model


optionsButton : Html msg
optionsButton =
    button [ type_ "button", class "optionsButton" ] [ text "⚙" ]


verticalToggle : Html msg
verticalToggle =
    let
        classes =
            classList
                [ ( "verticalToggle", True )
                , ( "verticalToggle-is-up", True )
                , ( "verticalToggle-is-down", False )
                ]
    in
    button [ type_ "button", classes ] [ text "▲" ]


quoteBox : Html msg
quoteBox =
    let
        classes =
            classList
                [ ( "quoteBox", True )
                , ( "quoteBox-is-expanded", False )
                , ( "quoteBox-is-collapsed", True )
                ]
    in
    div [ classes ]
        [ div [ class "quoteBox--quote" ] [ text "hello" ]
        , div [ class "quoteBox--author" ] [ text "john" ]
        , hr [ class "quoteBox--rule" ] []
        , div [ class "quoteBox--infoLink" ]
            [ a [ href "http://foo.foo" ] [ text "🌎 http://foo.foo" ] ]
        , div [ class "quoteBox--category" ] [ text "📦 Mindset" ]
        , verticalToggle
        ]


view : Model -> Html Action
view model =
    div
        [ id "root", class "l-root indexCard" ]
        [ optionsButton
        , quoteBox
        ]


main : Program () Model Action
main =
    Browser.sandbox
        { init = initModel
        , update = update
        , view = view
        }
