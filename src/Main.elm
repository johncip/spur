module Main exposing (main)

import CssModules exposing (css)
import Html exposing (Html, a, button, div, hr, text)
import Html.Attributes exposing (class, classList, href, id, type_)


styles =
    css "../assets/styles/app/style.scss"
        { indexCard = "indexCard" }


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


main : Html msg
main =
    div
        [ id "root", class "l-root", styles.class .indexCard ]
        [ optionsButton
        , quoteBox
        ]
